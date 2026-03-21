// @ts-nocheck
import { SoundManager, Collision, randomRange } from './utils';
import { Bullet } from './bullet';
import { ItemType } from './item';

export class Tank {
    constructor(x, y, width, height, color, hp) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle = 0; // 弧度
        this.speed = 3;
        this.hp = hp;
        this.maxHp = hp;
        this.active = true;
        this.cooldown = 0;
        this.maxCooldown = 30;
        this.id = Math.random().toString(36).substr(2, 9);
        
        // 状态效果
        this.isGiant = false;
        this.giantTimer = 0;
        this.hasExplosiveAmmo = false;
        this.explosiveAmmoCount = 0;
        this.isInvisible = false;
        this.invisibleTimer = 0;

        // 动画相关
        this.trackOffset = 0;
    }

    update(canvasWidth, canvasHeight) {
        if (this.cooldown > 0) this.cooldown--;
        
        // 状态计时器更新
        if (this.isGiant) {
            this.giantTimer--;
            if (this.giantTimer <= 0) {
                this.isGiant = false;
                this.width /= 1.5;
                this.height /= 1.5;
            }
        }
        
        if (this.isInvisible) {
            this.invisibleTimer--;
            if (this.invisibleTimer <= 0) {
                this.isInvisible = false;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        if (this.isInvisible) {
            ctx.globalAlpha = 0.4;
        }

        const w = this.width;
        const h = this.height;
        const isPlayer = this instanceof PlayerTank;
        const isBoss = this instanceof EnemyTank && this.isBoss;

        // 阴影
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        // 1. 履带 (更细致)
        const trackColor = '#2c2c2c';
        const trackDetailColor = '#1a1a1a';
        
        // 左履带
        this.drawTrack(ctx, -w/2, -h/2, w, h/4, trackColor, trackDetailColor);
        // 右履带
        this.drawTrack(ctx, -w/2, h/4, w, h/4, trackColor, trackDetailColor);

        // 2. 车身主体
        // 梯形车身
        // 渐变色
        let bodyGrad = ctx.createLinearGradient(-w/2, 0, w/2, 0);
        if (isPlayer) {
            // 现代迷彩绿
            bodyGrad.addColorStop(0, '#4b5320');
            bodyGrad.addColorStop(0.5, '#6b8e23');
            bodyGrad.addColorStop(1, '#4b5320');
        } else if (isBoss) {
            // Boss 紫色金属
            bodyGrad.addColorStop(0, '#4b0082');
            bodyGrad.addColorStop(0.5, '#8a2be2');
            bodyGrad.addColorStop(1, '#4b0082');
        } else {
            // 敌军 沙漠迷彩
            bodyGrad.addColorStop(0, '#8b4513');
            bodyGrad.addColorStop(0.5, '#cd853f');
            bodyGrad.addColorStop(1, '#8b4513');
        }

        ctx.fillStyle = bodyGrad;
        
        // 绘制梯形车身
        ctx.beginPath();
        ctx.moveTo(-w/2 + 4, -h/4);
        ctx.lineTo(w/2 - 4, -h/4);
        ctx.lineTo(w/2 - 2, h/4);
        ctx.lineTo(-w/2 + 2, h/4);
        ctx.closePath();
        ctx.fill();
        
        // 车身细节：装甲板接缝
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // 横向线
        ctx.moveTo(-w/2 + 4, 0); ctx.lineTo(w/2 - 4, 0);
        // 纵向线
        ctx.moveTo(-w/6, -h/4); ctx.lineTo(-w/6, h/4);
        ctx.moveTo(w/6, -h/4); ctx.lineTo(w/6, h/4);
        ctx.stroke();

        // 后部排气格栅
        ctx.fillStyle = '#111';
        ctx.fillRect(-w/2 + 6, -h/6, 4, h/3);
        // 散热孔
        ctx.fillStyle = '#333';
        ctx.fillRect(-w/2 + 6, -h/6 + 2, 4, 2);
        ctx.fillRect(-w/2 + 6, -h/6 + 6, 4, 2);
        ctx.fillRect(-w/2 + 6, -h/6 + 10, 4, 2);

        ctx.shadowColor = 'transparent'; // 重置阴影

        // 3. 炮塔
        let turretGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, w/3);
        if (isPlayer) {
            turretGrad.addColorStop(0, '#556b2f');
            turretGrad.addColorStop(1, '#2f4f4f');
        } else if (isBoss) {
            turretGrad.addColorStop(0, '#9370db');
            turretGrad.addColorStop(1, '#483d8b');
        } else {
            turretGrad.addColorStop(0, '#d2691e');
            turretGrad.addColorStop(1, '#8b4500');
        }
        
        ctx.fillStyle = turretGrad;
        ctx.beginPath();
        // 稍微拉长的炮塔
        ctx.ellipse(0, 0, w/3, w/3.5, 0, 0, Math.PI*2);
        ctx.fill();
        // 炮塔边缘线
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 舱盖
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(-5, -5, w/10, 0, Math.PI*2);
        ctx.fill();

        // 4. 炮管
        const barrelLen = w/1.1;
        const barrelWidth = h/6;
        
        // 炮管渐变
        let barrelGrad = ctx.createLinearGradient(0, -barrelWidth/2, 0, barrelWidth/2);
        barrelGrad.addColorStop(0, '#333');
        barrelGrad.addColorStop(0.5, '#666');
        barrelGrad.addColorStop(1, '#222');
        
        ctx.fillStyle = barrelGrad;
        ctx.fillRect(0, -barrelWidth/2, barrelLen, barrelWidth);
        
        // 炮口制退器
        ctx.fillStyle = '#111';
        ctx.fillRect(barrelLen - 4, -barrelWidth/2 - 2, 6, barrelWidth + 4);

        // 5. 无敌护盾特效
        if (isPlayer && this.hp <= 1) {
            const time = Date.now() / 200;
            
            // 旋转光圈
            ctx.save();
            ctx.rotate(time);
            ctx.beginPath();
            ctx.arc(0, 0, w * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.stroke();
            ctx.restore();
            
            // 反向旋转光圈
            ctx.save();
            ctx.rotate(-time * 1.5);
            ctx.beginPath();
            ctx.arc(0, 0, w * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = '#00BFFF';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 15]);
            ctx.stroke();
            ctx.restore();

            // 内部能量场
            ctx.beginPath();
            ctx.arc(0, 0, w * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${0.2 + Math.sin(time * 5) * 0.1})`;
            ctx.fill();
        }

        ctx.restore();

        // 血条
        this.drawHealthBar(ctx);
    }

    drawTrack(ctx, x, y, w, h, color, detailColor) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        
        // 履带纹理滚动
        ctx.fillStyle = detailColor;
        const trackSpacing = 6;
        for(let i = 0; i < w; i+=trackSpacing) {
            let offset = (i + Math.floor(this.trackOffset)) % w;
            if (offset < 0) offset += w; // 处理负数
            ctx.fillRect(x + offset, y, 2, h);
        }
    }

    roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 5;
        const x = this.x;
        const y = this.y - 10;
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(x, y, barWidth * (this.hp / this.maxHp), barHeight);
    }

    shoot(bullets) {
        if (this.cooldown <= 0) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            // 炮口位置
            const muzzleX = centerX + Math.cos(this.angle) * (this.width / 1.2);
            const muzzleY = centerY + Math.sin(this.angle) * (this.width / 1.2);
            
            let isExplosive = false;
            if (this.hasExplosiveAmmo) {
                isExplosive = true;
                this.explosiveAmmoCount--;
                if (this.explosiveAmmoCount <= 0) this.hasExplosiveAmmo = false;
            }

            const owner = this instanceof PlayerTank ? 'player' : 'enemy';
            bullets.push(new Bullet(muzzleX, muzzleY, this.angle, owner, isExplosive));
            this.cooldown = this.maxCooldown;
            SoundManager.playShoot();
        }
    }

    takeDamage(amount) {
        // 玩家无敌逻辑：只有玩家在血量 <= 1 时才无敌
        if (this instanceof PlayerTank) {
            if (this.hp <= 1) return; // 已经是1血，不再扣血
            
            this.hp -= amount;
            if (this.hp <= 1) {
                this.hp = 1; // 锁定在1血
                // 可以在这里播放一个护盾激活音效
            }
        } else {
            // 敌方坦克正常扣血
            this.hp -= amount;
        }

        if (this.hp <= 0) {
            this.active = false;
            SoundManager.playExplosion();
        } else {
            SoundManager.playHit(); // 击中但未死
        }
    }
}

export class PlayerTank extends Tank {
    constructor(x, y) {
        super(x, y, 40, 40, '#4CAF50', 100);
        this.speed = 4;
    }

    update(input, canvasWidth, canvasHeight, mapManager, enemies) {
        super.update(canvasWidth, canvasHeight);
        
        let dx = 0;
        let dy = 0;

        if (input.keys['w'] || input.keys['ArrowUp']) dy = -1;
        if (input.keys['s'] || input.keys['ArrowDown']) dy = 1;
        if (input.keys['a'] || input.keys['ArrowLeft']) dx = -1;
        if (input.keys['d'] || input.keys['ArrowRight']) dx = 1;

        if (dx !== 0 || dy !== 0) {
            const nextX = this.x + dx * this.speed;
            const nextY = this.y + dy * this.speed;
            
            // 碰撞检测
            let canMove = true;
            const rect = {x: nextX, y: nextY, width: this.width, height: this.height};

            if (mapManager) {
                if (mapManager.checkCollision(rect).length > 0) {
                    canMove = false;
                }
            }

            // 检查与敌人的碰撞
            if (canMove && enemies) {
                for (const enemy of enemies) {
                    if (enemy.active && Collision.rectRect(rect, enemy)) {
                        canMove = false;
                        break;
                    }
                }
            }

            if (canMove) {
                this.x = nextX;
                this.y = nextY;
                this.trackOffset += this.speed;
            }

            this.angle = Math.atan2(dy, dx);
        }

        // 边界限制
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
    }
    
    applyItem(item) {
        SoundManager.playPowerUp();
        switch (item.type) {
            case ItemType.INVISIBLE:
                this.isInvisible = true;
                this.invisibleTimer = 600; // 10秒
                break;
            case ItemType.GIANT:
                if (!this.isGiant) {
                    this.isGiant = true;
                    this.width *= 1.5;
                    this.height *= 1.5;
                    this.giantTimer = 600;
                } else {
                    this.giantTimer = 600; // 刷新时间
                }
                break;
            case ItemType.EXPLOSIVE:
                this.hasExplosiveAmmo = true;
                this.explosiveAmmoCount = 10;
                break;
            case ItemType.HEAL:
                this.hp = Math.min(this.hp + 50, this.maxHp);
                break;
        }
    }
}

export class EnemyTank extends Tank {
    constructor(x, y, level, isBoss = false) {
        const size = isBoss ? 80 : 40;
        const hp = isBoss ? 10 : 30 + level * 10; // Boss 10血
        const color = isBoss ? '#800080' : '#FF6347'; // Boss 紫色，普通 红色
        
        super(x, y, size, size, color, hp);
        
        this.isBoss = isBoss;
        this.speed = isBoss ? 1.5 : 0.8 + Math.random() * 0.4; // Boss 速度加快
        this.moveTimer = 0;
        this.moveDir = { x: 0, y: 0 };
        this.detectionRange = 300;
        this.maxCooldown = isBoss ? 40 : 60;
    }

    update(player, canvasWidth, canvasHeight, bullets, mapManager, enemies) {
        super.update(canvasWidth, canvasHeight);

        // AI 逻辑
        const canSeePlayer = !player.isInvisible && player.active;
        
        let nextX = this.x;
        let nextY = this.y;
        let moving = false;
        let chasing = false;

        if (canSeePlayer) {
            const dx = (player.x + player.width/2) - (this.x + this.width/2);
            const dy = (player.y + player.height/2) - (this.y + this.height/2);
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // 只有在 3个身位 (约120-150像素) 内才发现玩家
            const detectionRange = this.width * 4; // 40 * 4 = 160像素

            if (dist < detectionRange) {
                chasing = true;
                // 瞄准玩家
                this.angle = Math.atan2(dy, dx);

                // 移动逻辑
                if (dist > 100) { // 保持一定距离
                    nextX += Math.cos(this.angle) * this.speed;
                    nextY += Math.sin(this.angle) * this.speed;
                    moving = true;
                }

                // 射击逻辑
                this.shoot(bullets);
            }
        } 
        
        if (!chasing) {
            // 随机移动 (巡逻)
            this.moveTimer--;
            if (this.moveTimer <= 0) {
                this.moveTimer = randomRange(50, 150);
                const angle = randomRange(0, Math.PI * 2);
                this.moveDir.x = Math.cos(angle);
                this.moveDir.y = Math.sin(angle);
                this.angle = angle;
            }
            
            nextX += this.moveDir.x * this.speed;
            nextY += this.moveDir.y * this.speed;
            moving = true;
        }

        // 碰撞检测与移动应用
        if (moving) {
            let canMove = true;
            
            // 边界检查
            if (nextX < 0 || nextX > canvasWidth - this.width || nextY < 0 || nextY > canvasHeight - this.height) {
                canMove = false;
            }

            const rect = {x: nextX, y: nextY, width: this.width, height: this.height};

            // 障碍物检查
            if (canMove && mapManager) {
                if (mapManager.checkCollision(rect).length > 0) {
                    canMove = false;
                }
            }

            // 坦克碰撞检查
            if (canMove) {
                // 检查玩家
                if (player.active && Collision.rectRect(rect, player)) {
                    canMove = false;
                }
                // 检查其他敌人
                if (canMove && enemies) {
                    for (const other of enemies) {
                        if (other !== this && other.active && Collision.rectRect(rect, other)) {
                            canMove = false;
                            break;
                        }
                    }
                }
            }

            if (canMove) {
                this.x = nextX;
                this.y = nextY;
                this.trackOffset += this.speed;
            } else {
                // 遇到障碍，重置随机移动计时器，促使换方向
                this.moveTimer = 0;
            }
        }
    }
}
