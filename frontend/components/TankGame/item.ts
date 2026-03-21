// @ts-nocheck
export const ItemType = {
    INVISIBLE: 'invisible', // 隐身
    GIANT: 'giant',         // 变大
    EXPLOSIVE: 'explosive', // 爆炸弹
    HEAL: 'heal',           // 加血
    ARMOR: 'armor'          // 无敌铠甲
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
        const rand = Math.random();
        if (rand < 0.3) {
            return ItemType.ARMOR; // 30% 概率生成无敌铠甲
        }
        
        // 其他道具平分剩下的 70%
        const otherTypes = [ItemType.INVISIBLE, ItemType.GIANT, ItemType.EXPLOSIVE, ItemType.HEAL];
        return otherTypes[Math.floor(Math.random() * otherTypes.length)];
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
            case ItemType.ARMOR:
                color = '#FFD700'; // 金色
                icon = ''; // 自定义绘制
                break;
        }
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (this.type === ItemType.ARMOR) {
            // 绘制金色盾牌
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(8, -8);
            ctx.lineTo(8, 2);
            ctx.lineTo(0, 10);
            ctx.lineTo(-8, 2);
            ctx.lineTo(-8, -8);
            ctx.closePath();
            ctx.fill();
            
            // 绘制闪电图案
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(2, -6);
            ctx.lineTo(-4, 0);
            ctx.lineTo(0, 0);
            ctx.lineTo(-2, 8);
            ctx.lineTo(4, -1);
            ctx.lineTo(0, -1);
            ctx.closePath();
            ctx.fill();
        } else {
            this.drawIcon(ctx, icon);
        }
        
        ctx.restore();
    }

    drawIcon(ctx, text) {
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 0);
    }
}
