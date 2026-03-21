// @ts-nocheck
import { Collision } from './utils';

export const ObstacleType = {
    WALL: 'wall',   // 土墙，可破坏
    STEEL: 'steel', // 铁墙，不可破坏
    GRASS: 'grass'  // 草丛，隐蔽
};

export class Obstacle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.type = type;
        this.active = true;
        this.hp = type === ObstacleType.WALL ? 20 : 9999;
        
        // 预生成草丛叶片数据，避免每帧随机导致闪烁
        if (type === ObstacleType.GRASS) {
            this.grassBlades = [];
            for(let i=0; i<25; i++) {
                this.grassBlades.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    height: 8 + Math.random() * 12,
                    angle: (Math.random() - 0.5) * 0.8,
                    color: `rgba(${20 + Math.random()*30}, ${100 + Math.random()*60}, ${20 + Math.random()*30}, 0.85)`
                });
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.type === ObstacleType.WALL) {
            // 土墙纹理 - 更立体
            // 基础色
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // 砖块效果
            ctx.fillStyle = '#A0522D';
            const brickH = 10;
            const brickW = 20;
            
            for(let y=0; y<this.height; y+=brickH) {
                const offset = (y/brickH % 2) * (brickW/2);
                for(let x=-brickW/2; x<this.width; x+=brickW) {
                    // 绘制单个砖块
                    ctx.fillRect(x + offset + 1, y + 1, brickW - 2, brickH - 2);
                    
                    // 砖块高光和阴影
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(x + offset + 1, y + 1, brickW - 2, 2);
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.fillRect(x + offset + 1, y + brickH - 2, brickW - 2, 2);
                    
                    // 恢复砖块色
                    ctx.fillStyle = '#A0522D';
                }
            }

            // 破损效果
            if (this.hp < 20) {
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.beginPath();
                ctx.arc(20, 20, 12, 0, Math.PI*2);
                ctx.fill();
                // 裂纹
                ctx.strokeStyle = '#3e2723';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(20, 20); ctx.lineTo(10, 10);
                ctx.moveTo(20, 20); ctx.lineTo(30, 35);
                ctx.stroke();
            }

        } else if (this.type === ObstacleType.STEEL) {
            // 铁墙纹理 - 金属质感
            const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
            grad.addColorStop(0, '#C0C0C0');
            grad.addColorStop(0.5, '#E0E0E0');
            grad.addColorStop(1, '#A0A0A0');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // 边框
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, this.width, this.height);
            
            // 交叉钢板
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(this.width, this.height);
            ctx.moveTo(this.width, 0); ctx.lineTo(0, this.height);
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.stroke();
            
            // 铆钉
            ctx.fillStyle = '#555';
            const r = 3;
            ctx.beginPath();
            ctx.arc(5, 5, r, 0, Math.PI*2);
            ctx.arc(this.width-5, 5, r, 0, Math.PI*2);
            ctx.arc(5, this.height-5, r, 0, Math.PI*2);
            ctx.arc(this.width-5, this.height-5, r, 0, Math.PI*2);
            ctx.fill();

        } else if (this.type === ObstacleType.GRASS) {
            const time = Date.now() / 1000;
            
            // 整体透明度变化动画
            const globalAlpha = 0.8 + Math.sin(time * 2 + this.x) * 0.2;
            ctx.globalAlpha = globalAlpha;

            // 草丛纹理 - 细腻渐变与光影 (颜色渐变动画)
            const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
            // 颜色随时间微调，产生呼吸感
            const rOffset = Math.sin(time * 1.5 + this.y) * 15;
            grad.addColorStop(0, `rgba(${34 + rOffset}, 139, 34, 0.4)`);
            grad.addColorStop(0.5, `rgba(46, ${139 + rOffset}, 87, 0.5)`);
            grad.addColorStop(1, `rgba(0, 100, 0, 0.6)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);

            // 绘制细腻的草叶线条 (飘动效果)
            if (this.grassBlades) {
                this.grassBlades.forEach(blade => {
                    ctx.save();
                    ctx.translate(blade.x, blade.y);
                    
                    // 飘动效果：基础角度 + 随时间变化的正弦波偏移
                    const sway = Math.sin(time * 3 + blade.x + blade.y) * 0.3;
                    ctx.rotate(blade.angle + sway);
                    
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    // 绘制尖锐的草叶
                    ctx.quadraticCurveTo(3, -blade.height/2, 0, -blade.height);
                    ctx.quadraticCurveTo(-3, -blade.height/2, 0, 0);
                    
                    ctx.fillStyle = blade.color;
                    ctx.fill();
                    ctx.restore();
                });
            }
            
            // 添加斑驳的光影质感 (简单的半透明高光点，随时间闪烁)
            ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(time * 4 + this.x) * 0.04})`;
            ctx.beginPath();
            ctx.arc(this.width * 0.3, this.height * 0.3, 8, 0, Math.PI * 2);
            ctx.arc(this.width * 0.7, this.height * 0.6, 12, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1.0; // 恢复透明度
        }

        ctx.restore();
    }
}

export class MapManager {
    constructor() {
        this.obstacles = [];
    }

    generate(level, canvasWidth, canvasHeight) {
        this.obstacles = [];
        const cols = Math.floor(canvasWidth / 40);
        const rows = Math.floor(canvasHeight / 40);
        
        // 简单的随机生成算法，保留中间区域给玩家
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                // 玩家出生点附近留空
                const centerX = Math.floor(cols / 2);
                const centerY = Math.floor(rows / 2);
                if (Math.abs(c - centerX) < 3 && Math.abs(r - centerY) < 3) continue;

                // 随机生成障碍物
                const rand = Math.random();
                // 随着关卡增加，障碍物密度可能变化
                if (rand < 0.1) {
                    this.obstacles.push(new Obstacle(c * 40, r * 40, ObstacleType.STEEL));
                } else if (rand < 0.25) {
                    this.obstacles.push(new Obstacle(c * 40, r * 40, ObstacleType.WALL));
                } else if (rand < 0.35) {
                    this.obstacles.push(new Obstacle(c * 40, r * 40, ObstacleType.GRASS));
                }
            }
        }
    }

    draw(ctx, layer) {
        // layer: 'bottom' (墙, 铁) or 'top' (草)
        this.obstacles.forEach(obs => {
            if (!obs.active) return;
            if (layer === 'top' && obs.type === ObstacleType.GRASS) {
                obs.draw(ctx);
            } else if (layer === 'bottom' && obs.type !== ObstacleType.GRASS) {
                obs.draw(ctx);
            }
        });
    }
    
    checkCollision(rect) {
        // 返回碰撞的障碍物列表
        return this.obstacles.filter(obs => {
            if (!obs.active) return false;
            if (obs.type === ObstacleType.GRASS) return false; // 草丛不阻挡移动
            return Collision.rectRect(rect, obs);
        });
    }
}
