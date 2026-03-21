// @ts-nocheck
import { Particle } from './utils';

export class Bullet {
    constructor(x, y, angle, owner, isExplosive = false) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.owner = owner; // 'player' or 'enemy'
        this.speed = this.owner === 'player' ? 8 : 4; // 玩家子弹速度更快
        this.radius = 6; // 增加碰撞判定范围
        this.active = true;
        this.isExplosive = isExplosive;
        this.damage = 10;
        this.trail = [];
        
        // 计算速度分量
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update(canvasWidth, canvasHeight) {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 6) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        // 边界检查
        if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // 绘制飞行轨迹
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.isExplosive ? 'rgba(255, 69, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = this.radius * 0.8;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        ctx.translate(this.x, this.y);
        
        // 绘制更精致的炮弹
        // 尾焰
        ctx.beginPath();
        ctx.arc(-this.radius * 0.8, 0, this.radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
        ctx.fill();

        // 弹头
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
        // 渐变色
        const grad = ctx.createRadialGradient(-2, -2, 0, 0, 0, this.radius);
        if (this.isExplosive) {
            grad.addColorStop(0, '#FFD700');
            grad.addColorStop(1, '#FF4500');
        } else if (this.owner === 'player') {
            grad.addColorStop(0, '#FFFFE0');
            grad.addColorStop(1, '#FFD700');
        } else {
            grad.addColorStop(0, '#FFC0CB');
            grad.addColorStop(1, '#FF0000');
        }
        ctx.fillStyle = grad;
        ctx.fill();
        
        // 高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-1, -1, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

export class HitEffect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.active = true;
        this.life = 15;
        
        for(let i=0; i<8; i++) {
            const color = Math.random() > 0.5 ? '#FFFF00' : '#FFA500';
            this.particles.push(new Particle(x, y, color, 3, 0.6));
        }
    }

    update() {
        this.life--;
        if (this.life <= 0) this.active = false;
        this.particles.forEach(p => p.update());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}

export class Explosion {
    constructor(x, y, radius = 20, damage = 20, owner = 'player') {
        this.x = x;
        this.y = y;
        this.maxRadius = radius;
        this.currentRadius = 5;
        this.growthRate = radius > 50 ? 4 : 2; // 大爆炸扩散更快
        this.active = true;
        this.alpha = 1;
        this.damage = damage;
        this.owner = owner;
        this.hasDamaged = []; 
        
        // 粒子系统 (烟雾、火焰、碎片)
        this.particles = [];
        const particleCount = radius > 50 ? 50 : 15;
        for(let i=0; i<particleCount; i++) {
            const rand = Math.random();
            let color;
            let speed = Math.random() * 6 + 2;
            let life = Math.random() * 0.6 + 0.4;
            
            if (rand < 0.4) {
                color = '#FF4500'; // 火焰
            } else if (rand < 0.7) {
                color = '#555555'; // 烟雾
                speed *= 0.5;
                life *= 1.5;
            } else {
                color = '#8B4513'; // 碎片
                speed *= 1.5;
            }
            this.particles.push(new Particle(x, y, color, speed, life));
        }
    }

    update() {
        if (this.currentRadius < this.maxRadius) {
            this.currentRadius += this.growthRate;
        } else {
            this.alpha -= 0.05;
            if (this.alpha <= 0) {
                this.active = false;
            }
        }
        
        // 更新粒子
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw(ctx) {
        ctx.save();
        
        // 动态爆炸光照
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentRadius * 1.5);
        grad.addColorStop(0, `rgba(255, 200, 0, ${this.alpha * 0.8})`);
        grad.addColorStop(0.5, `rgba(255, 50, 0, ${this.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        
        // 视觉冲击波
        ctx.globalAlpha = this.alpha * 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 140, 0, 0.3)';
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 粒子
        ctx.globalAlpha = 1;
        this.particles.forEach(p => p.draw(ctx));
        
        ctx.restore();
    }
}
