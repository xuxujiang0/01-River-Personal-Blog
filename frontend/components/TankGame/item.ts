// @ts-nocheck
export const ItemType = {
    INVISIBLE: 'invisible', // 隐身
    GIANT: 'giant',         // 变大
    EXPLOSIVE: 'explosive', // 爆炸弹
    HEAL: 'heal'            // 加血
};

export class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.active = true;
        this.type = this.randomType();
        this.blinkTimer = 0;
        this.lifeTime = 600; // 10秒 @ 60fps
    }

    randomType() {
        const types = Object.values(ItemType);
        return types[Math.floor(Math.random() * types.length)];
    }

    update() {
        this.lifeTime--;
        if (this.lifeTime <= 0) {
            this.active = false;
        }
        this.blinkTimer++;
    }

    draw(ctx) {
        if (this.lifeTime < 120 && Math.floor(this.blinkTimer / 10) % 2 === 0) {
            return; // 快消失时闪烁
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // 浮动动画
        const scale = 1 + Math.sin(this.blinkTimer * 0.1) * 0.1;
        ctx.scale(scale, scale);
        
        // 旋转光环
        ctx.rotate(this.blinkTimer * 0.05);
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.rotate(-this.blinkTimer * 0.05); // 恢复旋转，以免图标也旋转

        // 背景光晕
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        
        let icon = '';
        let color = '';

        switch (this.type) {
            case ItemType.INVISIBLE:
                color = '#87CEEB'; // 天蓝
                icon = '👻';
                break;
            case ItemType.GIANT:
                color = '#FFD700'; // 金色
                icon = '💪';
                break;
            case ItemType.EXPLOSIVE:
                color = '#FF4500'; // 橙红
                icon = '💣';
                break;
            case ItemType.HEAL:
                color = '#00FF00'; // 绿色
                icon = '❤️';
                break;
        }
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        this.drawIcon(ctx, icon);
        
        ctx.restore();
    }

    drawIcon(ctx, text) {
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 0);
    }
}
