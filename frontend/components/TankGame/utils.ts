// @ts-nocheck
// 音效管理器
export const SoundManager = {
    ctx: null,
    
    init: function() {
        if (this.ctx) return;
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch(e) {
            console.error('Web Audio API is not supported in this browser');
        }
    },

    playTone: function(freq, type, duration, vol = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playShoot: function() {
        // 射击音效：高频快速衰减
        this.playTone(800, 'square', 0.1, 0.1);
    },

    playHit: function() {
        // 击中音效：短促的金属撞击声
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    playExplosion: function() {
        // 爆炸音效：低频噪音
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        
        // 简单的低通滤波器模拟爆炸沉闷感
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    },

    playPowerUp: function() {
        // 道具音效：清脆的上行音
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    },
    
    playLevelUp: function() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    }
};

// 粒子系统
export class Particle {
    constructor(x, y, color, speed, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * speed;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 1;
        this.decay = Math.random() * 0.05 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.95; // 逐渐变小
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 碰撞检测工具
export const Collision = {
    rectRect: function(r1, r2) {
        return !(r2.x > r1.x + r1.width || 
                 r2.x + r2.width < r1.x || 
                 r2.y > r1.y + r1.height || 
                 r2.y + r2.height < r1.y);
    },
    
    circleRect: function(circle, rect) {
        let distX = Math.abs(circle.x - rect.x - rect.width / 2);
        let distY = Math.abs(circle.y - rect.y - rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius)) { return false; }
        if (distY > (rect.height / 2 + circle.radius)) { return false; }

        if (distX <= (rect.width / 2)) { return true; } 
        if (distY <= (rect.height / 2)) { return true; }

        let dx = distX - rect.width / 2;
        let dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }
};

export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

