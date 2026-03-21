// @ts-nocheck
import { SoundManager, Collision } from './utils';
import { MapManager, ObstacleType } from './map';
import { PlayerTank, EnemyTank } from './tank';
import { Item, ItemType } from './item';
import { Explosion, HitEffect } from './bullet';

export class TankGameEngine {
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.callbacks = callbacks; // { onStateChange, onStatsChange }
        
        this.gameState = 'start'; // start, playing, gameover, levelup
        this.level = 1;
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.items = [];
        this.explosions = [];
        this.hitEffects = [];
        this.animationId = null;
        this.mapManager = null;
        this.itemSpawnTimer = 0;
        
        // 屏幕特效状态
        this.screenShake = 0;
        this.screenFlash = 0;
        
        this.input = { keys: {} };
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('resize', this.handleResize);
        
        this.handleResize();
    }
    
    handleKeyDown(e) {
        this.input.keys[e.key] = true;
        if (e.key === ' ' && this.gameState === 'playing' && this.player && this.player.active) {
            this.player.shoot(this.bullets);
        }
    }
    
    handleKeyUp(e) {
        this.input.keys[e.key] = false;
    }
    
    handleResize() {
        if (this.canvas.parentElement) {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }
    
    initGame() {
        this.handleResize();
        SoundManager.init();
        this.level = 1;
        this.mapManager = new MapManager();
        this.startGame();
    }
    
    startGame() {
        this.player = new PlayerTank(this.canvas.width / 2, this.canvas.height / 2);
        this.bullets = [];
        this.items = [];
        this.explosions = [];
        this.hitEffects = [];
        this.screenShake = 0;
        this.screenFlash = 0;
        this.startLevel();
        this.setGameState('playing');
        
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.gameLoop();
    }
    
    startLevel() {
        this.enemies = [];
        this.bullets = []; // 清除上一关子弹
        this.items = [];
        this.hitEffects = [];
        this.itemSpawnTimer = 0;
        
        // 生成地图
        this.mapManager.generate(this.level, this.canvas.width, this.canvas.height);

        // 生成敌人
        const enemyCount = 3 + this.level;
        for (let i = 0; i < enemyCount; i++) {
            this.spawnEnemy(false);
        }
        // 生成 Boss
        this.spawnEnemy(true);
        
        this.updateStats();
        
        // 玩家位置重置到中心 (确保不卡在墙里)
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        // 简单的防卡死检查，如果出生点有墙，清空周围
        const centerRect = {x: this.player.x - 50, y: this.player.y - 50, width: 140, height: 140};
        this.mapManager.obstacles.forEach(obs => {
            if (Collision.rectRect(centerRect, obs)) {
                obs.active = false;
            }
        });
    }
    
    spawnEnemy(isBoss) {
        // 随机位置，远离玩家且不在墙内
        let x, y, dist, validPosition = false;
        let attempts = 0;
        
        do {
            x = Math.random() * (this.canvas.width - 50);
            y = Math.random() * (this.canvas.height - 50);
            const dx = x - this.player.x;
            const dy = y - this.player.y;
            dist = Math.sqrt(dx*dx + dy*dy);
            
            // 检查是否与障碍物重叠
            const rect = {x: x, y: y, width: isBoss?80:40, height: isBoss?80:40};
            const collisions = this.mapManager.checkCollision(rect);
            
            if (dist > 300 && collisions.length === 0) {
                validPosition = true;
            }
            attempts++;
        } while (!validPosition && attempts < 50);

        // 如果找不到合适位置，强制生成在角落
        if (!validPosition) {
            x = 50; y = 50;
        }

        this.enemies.push(new EnemyTank(x, y, this.level, isBoss));
    }
    
    spawnRandomItem() {
        let x, y;
        let attempts = 0;
        let valid = false;
        do {
            x = Math.random() * (this.canvas.width - 40);
            y = Math.random() * (this.canvas.height - 40);
            const rect = {x: x, y: y, width: 20, height: 20};
            if (this.mapManager.checkCollision(rect).length === 0) {
                valid = true;
            }
            attempts++;
        } while (!valid && attempts < 10);
        
        if (valid) {
            this.items.push(new Item(x, y));
        }
    }
    
    setGameState(state) {
        this.gameState = state;
        if (this.callbacks.onStateChange) {
            this.callbacks.onStateChange(state);
        }
    }
    
    updateStats() {
        if (this.callbacks.onStatsChange) {
            this.callbacks.onStatsChange({
                level: this.level,
                enemies: this.enemies.length,
                hp: Math.max(0, Math.floor(this.player ? this.player.hp : 0))
            });
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;

        // 道具生成
        this.itemSpawnTimer++;
        if (this.itemSpawnTimer > 120) { // 2秒 @ 60fps (加快生成频率)
            this.itemSpawnTimer = 0;
            this.spawnRandomItem();
        }

        // 更新玩家
        if (this.player.active) {
            this.player.update(this.input, this.canvas.width, this.canvas.height, this.mapManager, this.enemies);
        } else {
            this.setGameState('gameover');
        }

        // 更新敌人
        this.enemies.forEach(enemy => enemy.update(this.player, this.canvas.width, this.canvas.height, this.bullets, this.mapManager, this.enemies));
        
        // 更新子弹
        this.bullets.forEach(bullet => bullet.update(this.canvas.width, this.canvas.height));
        
        // 更新道具
        this.items.forEach(item => item.update());
        
        // 更新爆炸
        this.explosions.forEach(exp => exp.update());

        // 更新击中特效
        this.hitEffects.forEach(effect => effect.update());

        // 更新屏幕特效
        if (this.screenShake > 0) this.screenShake *= 0.9;
        if (this.screenShake < 0.5) this.screenShake = 0;
        if (this.screenFlash > 0) this.screenFlash -= 0.05;
        if (this.screenFlash < 0) this.screenFlash = 0;

        // 清理不活跃对象
        this.bullets = this.bullets.filter(b => b.active);
        this.items = this.items.filter(i => i.active);
        this.explosions = this.explosions.filter(e => e.active);
        this.hitEffects = this.hitEffects.filter(e => e.active);
        this.enemies = this.enemies.filter(e => e.active);
        
        // 碰撞检测
        this.checkCollisions();
        
        // 关卡检查
        if (this.enemies.length === 0 && this.gameState === 'playing') {
            // 关卡完成
            this.setGameState('levelup');
            SoundManager.playLevelUp();
            setTimeout(() => {
                if (this.gameState === 'levelup') { // 确保没有被重置
                    this.level++;
                    this.startLevel();
                    this.setGameState('playing');
                }
            }, 3000);
        }
        
        // 更新 UI
        this.updateStats();
    }
    
    checkCollisions() {
        // 子弹击中坦克或障碍物
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;

            // 1. 检查障碍物碰撞
            const bulletRect = {x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, width: bullet.radius*2, height: bullet.radius*2};
            const hitObstacles = this.mapManager.checkCollision(bulletRect);
            
            if (hitObstacles.length > 0) {
                // 只要碰到障碍物（除了草），子弹就销毁
                bullet.active = false;
                
                hitObstacles.forEach(obs => {
                    if (obs.type === ObstacleType.WALL) {
                        obs.hp -= bullet.damage;
                        if (obs.hp <= 0) obs.active = false;
                    }
                });

                if (bullet.isExplosive) {
                    this.explosions.push(new Explosion(bullet.x, bullet.y, 80, 30, bullet.owner));
                    SoundManager.playExplosion();
                    this.screenShake = 15;
                    this.screenFlash = 0.3;
                } else {
                    this.hitEffects.push(new HitEffect(bullet.x, bullet.y));
                    SoundManager.playHit();
                }
                return; // 子弹已销毁，不再检测坦克
            }

            // 2. 击中敌人
            if (bullet.owner === 'player') {
                this.enemies.forEach(enemy => {
                    if (enemy.active && bullet.active) { // 确保子弹还活着
                        const bRect = {x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, width: bullet.radius*2, height: bullet.radius*2};
                        if (Collision.rectRect(bRect, enemy)) {
                            bullet.active = false;
                            
                            if (bullet.isExplosive) {
                                this.explosions.push(new Explosion(bullet.x, bullet.y, 80, 30, 'player'));
                                SoundManager.playExplosion();
                                this.screenShake = 15;
                                this.screenFlash = 0.3;
                            } else {
                                enemy.takeDamage(bullet.damage);
                                this.hitEffects.push(new HitEffect(bullet.x, bullet.y));
                            }
                        }
                    }
                });
            } 
            // 3. 击中玩家
            else if (bullet.owner === 'enemy') {
                if (this.player.active && bullet.active) {
                    const bRect = {x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, width: bullet.radius*2, height: bullet.radius*2};
                    if (Collision.rectRect(bRect, this.player)) {
                        bullet.active = false;
                        this.player.takeDamage(bullet.damage);
                        this.hitEffects.push(new HitEffect(bullet.x, bullet.y));
                    }
                }
            }
        });

        // 爆炸伤害
        this.explosions.forEach(exp => {
            if (!exp.active) return;
            
            // 爆炸也能破坏墙壁
            const blastRect = {x: exp.x - exp.currentRadius, y: exp.y - exp.currentRadius, width: exp.currentRadius*2, height: exp.currentRadius*2};
            const hitObstacles = this.mapManager.checkCollision(blastRect);
            hitObstacles.forEach(obs => {
                 if (obs.type === ObstacleType.WALL && !exp.hasDamaged.includes('wall_'+obs.x+'_'+obs.y)) {
                     obs.hp -= exp.damage;
                     if (obs.hp <= 0) obs.active = false;
                     exp.hasDamaged.push('wall_'+obs.x+'_'+obs.y);
                 }
            });

            // 对所有在范围内的坦克造成伤害 (包括玩家和敌人)
            this.enemies.forEach(enemy => {
                if (enemy.active && !exp.hasDamaged.includes(enemy.id)) {
                    if (Collision.circleRect({x: exp.x, y: exp.y, radius: exp.currentRadius}, enemy)) {
                        enemy.takeDamage(exp.damage);
                        exp.hasDamaged.push(enemy.id);
                    }
                }
            });
            
            if (this.player.active && !exp.hasDamaged.includes(this.player.id)) {
                if (Collision.circleRect({x: exp.x, y: exp.y, radius: exp.currentRadius}, this.player)) {
                    this.player.takeDamage(exp.damage);
                    exp.hasDamaged.push(this.player.id);
                }
            }
        });

        // 玩家拾取道具
        this.items.forEach(item => {
            if (item.active && this.player.active && Collision.rectRect(this.player, item)) {
                item.active = false;
                this.player.applyItem(item);
            }
        });
    }
    
    draw() {
        this.ctx.save();
        
        // 应用屏幕震动
        if (this.screenShake > 0) {
            const dx = (Math.random() - 0.5) * this.screenShake;
            const dy = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(dx, dy);
        }

        // 清空画布 - 绘制地面背景
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();

        // 绘制底层障碍物 (墙, 铁)
        if (this.mapManager) this.mapManager.draw(this.ctx, 'bottom');

        // 绘制道具
        this.items.forEach(item => item.draw(this.ctx));

        // 绘制坦克
        if (this.player && this.player.active) this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));

        // 绘制顶层障碍物 (草)
        if (this.mapManager) this.mapManager.draw(this.ctx, 'top');

        // 绘制子弹
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        // 绘制击中特效
        this.hitEffects.forEach(effect => effect.draw(this.ctx));
        
        // 绘制爆炸
        this.explosions.forEach(exp => exp.draw(this.ctx));
        
        this.ctx.restore();
        
        // 绘制屏幕闪烁 (在震动恢复后绘制，覆盖全屏)
        if (this.screenFlash > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.screenFlash})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(this.gameLoop);
    }
    
    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('resize', this.handleResize);
        this.setGameState('start');
    }
}
