
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, RotateCcw, Zap, Cpu, Activity, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, Shield, Eye, EyeOff, Crosshair } from 'lucide-react';

// --- Shared Types ---
interface GameProps {
  isExpanded: boolean;
}

// --- Game 1: Tank Battle ---
type PowerUp = {
  x: number;
  y: number;
  type: 'size' | 'invincible' | 'shield' | 'invisible';
  icon: string;
};

type Enemy = {
  x: number;
  y: number;
  angle: number;
  health: number;
};

type Bullet = {
  x: number;
  y: number;
  angle: number;
  isPlayer: boolean;
};

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'wall' | 'rock';
  destructible: boolean;
};

const TankBattle: React.FC<GameProps> = ({ isExpanded }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [playerAngle, setPlayerAngle] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [powerUpEndTime, setPowerUpEndTime] = useState(0);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const lastShootTime = useRef(0);
  const lastPowerUpSpawn = useRef(0);
  const lastEnemySpawn = useRef(0);
  const currentAngle = useRef(0); // 使用ref立即同步角度

  const CANVAS_SIZE = isExpanded ? 600 : 280;
  const TANK_SIZE = activePowerUp === 'size' ? 24 : 16;
  const BULLET_SPEED = 4;
  const PLAYER_SPEED = 1.0; // 大幅降低移动速度，提高操控精度
  const ENEMY_SPEED = 0.8;
  const SHOOT_COOLDOWN = 500;
  const POWERUP_DURATION = 5000;

  // 生成障碍物
  const generateObstacles = useCallback(() => {
    const newObstacles: Obstacle[] = [];
    
    // 不生成边界墙，因为会超出范围
    // 只生成内部障碍物
    
    // 生成内部障碍物
    const obstaclePositions = [
      // 中心十字型墙壁
      { x: 45, y: 25, width: 10, height: 3, type: 'wall' as const },
      { x: 45, y: 72, width: 10, height: 3, type: 'wall' as const },
      { x: 25, y: 45, width: 3, height: 10, type: 'wall' as const },
      { x: 72, y: 45, width: 3, height: 10, type: 'wall' as const },
      
      // 四角的石头
      { x: 15, y: 15, width: 8, height: 8, type: 'rock' as const },
      { x: 80, y: 15, width: 8, height: 8, type: 'rock' as const },
      { x: 15, y: 80, width: 8, height: 8, type: 'rock' as const },
      { x: 80, y: 80, width: 8, height: 8, type: 'rock' as const },
      
      // 随机分布的小石头
      { x: 30, y: 30, width: 5, height: 5, type: 'rock' as const },
      { x: 65, y: 30, width: 5, height: 5, type: 'rock' as const },
      { x: 30, y: 65, width: 5, height: 5, type: 'rock' as const },
      { x: 65, y: 65, width: 5, height: 5, type: 'rock' as const },
    ];
    
    obstaclePositions.forEach(pos => {
      newObstacles.push({
        ...pos,
        destructible: pos.type === 'rock'
      });
    });
    
    return newObstacles;
  }, []);

  // 碰撞检测函数
  const checkCollision = (x: number, y: number, size: number, obstacles: Obstacle[]) => {
    for (const obstacle of obstacles) {
      const halfSize = size / 2;
      const obsLeft = obstacle.x - obstacle.width / 2;
      const obsRight = obstacle.x + obstacle.width / 2;
      const obsTop = obstacle.y - obstacle.height / 2;
      const obsBottom = obstacle.y + obstacle.height / 2;
      
      if (
        x + halfSize > obsLeft &&
        x - halfSize < obsRight &&
        y + halfSize > obsTop &&
        y - halfSize < obsBottom
      ) {
        return obstacle;
      }
    }
    return null;
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setPlayerPos({ x: 50, y: 50 });
    setPlayerAngle(0);
    currentAngle.current = 0; // 重置ref角度
    setPlayerHealth(3);
    setEnemies([]);
    setBullets([]);
    setPowerUps([]);
    setObstacles(generateObstacles());
    setActivePowerUp(null);
    lastShootTime.current = 0;
    lastPowerUpSpawn.current = Date.now();
    lastEnemySpawn.current = Date.now();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      keysPressed.current.add(e.key.toLowerCase());
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysPressed.current.clear();
    };
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      
      // Move player with collision detection
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
          const testY = Math.max(5, prev.y - PLAYER_SPEED);
          if (!checkCollision(prev.x, testY, TANK_SIZE, obstacles)) {
            newY = testY;
            currentAngle.current = -90; // 立即更新ref角度
            setPlayerAngle(-90); // 更新state角度用于渲染
          }
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
          const testY = Math.min(95, prev.y + PLAYER_SPEED);
          if (!checkCollision(prev.x, testY, TANK_SIZE, obstacles)) {
            newY = testY;
            currentAngle.current = 90; // 立即更新ref角度
            setPlayerAngle(90); // 更新state角度用于渲染
          }
        }
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
          const testX = Math.max(5, prev.x - PLAYER_SPEED);
          if (!checkCollision(testX, prev.y, TANK_SIZE, obstacles)) {
            newX = testX;
            currentAngle.current = 180; // 立即更新ref角度
            setPlayerAngle(180); // 更新state角度用于渲染
          }
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
          const testX = Math.min(95, prev.x + PLAYER_SPEED);
          if (!checkCollision(testX, prev.y, TANK_SIZE, obstacles)) {
            newX = testX;
            currentAngle.current = 0; // 立即更新ref角度
            setPlayerAngle(0); // 更新state角度用于渲染
          }
        }
        
        return { x: newX, y: newY };
      });

      // Auto shoot - 使用ref角度确保方向一致
      if (now - lastShootTime.current > SHOOT_COOLDOWN) {
        setBullets(prev => [...prev, {
          x: playerPos.x,
          y: playerPos.y,
          angle: currentAngle.current, // 使用ref中的最新角度
          isPlayer: true
        }]);
        lastShootTime.current = now;
      }

      // Spawn enemies (避开障碍物)
      if (now - lastEnemySpawn.current > 3000) { // 改为3秒生成一个
        let attempts = 0;
        let validPosition = false;
        let x = 0, y = 0;
        
        while (!validPosition && attempts < 10) {
          const side = Math.floor(Math.random() * 4);
          switch(side) {
            case 0: x = Math.random() * 80 + 10; y = 10; break; // 上边
            case 1: x = 90; y = Math.random() * 80 + 10; break; // 右边
            case 2: x = Math.random() * 80 + 10; y = 90; break; // 下边
            case 3: x = 10; y = Math.random() * 80 + 10; break; // 左边
          }
          
          if (!checkCollision(x, y, 16, obstacles)) {
            validPosition = true;
          }
          attempts++;
        }
        
        if (validPosition) {
          setEnemies(prev => [...prev, { x, y, angle: 0, health: 2 }]);
          console.log('敌人生成:', { x, y }); // 调试日志
        }
        lastEnemySpawn.current = now;
      }

      // Spawn power-ups (避开障碍物)
      if (now - lastPowerUpSpawn.current > 3000) {
        const types: PowerUp['type'][] = ['size', 'invincible', 'shield', 'invisible'];
        let attempts = 0;
        let validPosition = false;
        let x = 0, y = 0;
        
        while (!validPosition && attempts < 10) {
          x = Math.random() * 70 + 15;
          y = Math.random() * 70 + 15;
          
          if (!checkCollision(x, y, 6, obstacles)) {
            validPosition = true;
          }
          attempts++;
        }
        
        if (validPosition) {
          setPowerUps(prev => [...prev, {
            x, y,
            type: types[Math.floor(Math.random() * types.length)],
            icon: '✨'
          }]);
        }
        lastPowerUpSpawn.current = now;
      }

      // Move bullets and check obstacle collision
      setBullets(prev => {
        const newBullets = prev
          .map(b => {
            const rad = (b.angle * Math.PI) / 180;
            return {
              ...b,
              x: b.x + Math.cos(rad) * BULLET_SPEED * 0.3,
              y: b.y + Math.sin(rad) * BULLET_SPEED * 0.3
            };
          })
          .filter(b => {
            // 边界检测
            if (b.x < 0 || b.x > 100 || b.y < 0 || b.y > 100) return false;
            
            // 障碍物碰撞
            const hitObstacle = checkCollision(b.x, b.y, 2, obstacles);
            if (hitObstacle) {
              // 可破坏的障碍物被击中
              if (hitObstacle.destructible && b.isPlayer) {
                setObstacles(prevObs => prevObs.filter(o => o !== hitObstacle));
              }
              return false;
            }
            
            return true;
          });
        
        return newBullets;
      });

      // Move enemies towards player with collision avoidance
      setEnemies(prev => prev.map(e => {
        const dx = playerPos.x - e.x;
        const dy = playerPos.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
          const moveX = e.x + (dx / dist) * ENEMY_SPEED;
          const moveY = e.y + (dy / dist) * ENEMY_SPEED;
          
          // 检测碰撞
          if (!checkCollision(moveX, moveY, 16, obstacles)) {
            return {
              ...e,
              x: moveX,
              y: moveY,
              angle: Math.atan2(dy, dx) * 180 / Math.PI
            };
          }
        }
        return e;
      }));

      // Check collisions: bullets vs enemies
      setBullets(prevBullets => {
        const remaining = [...prevBullets];
        setEnemies(prevEnemies => {
          const newEnemies = prevEnemies.map(enemy => ({ ...enemy }));
          
          for (let i = remaining.length - 1; i >= 0; i--) {
            const bullet = remaining[i];
            if (!bullet.isPlayer) continue;
            
            for (let j = newEnemies.length - 1; j >= 0; j--) {
              const enemy = newEnemies[j];
              const dx = bullet.x - enemy.x;
              const dy = bullet.y - enemy.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 4) {
                remaining.splice(i, 1);
                newEnemies[j].health--;
                if (newEnemies[j].health <= 0) {
                  newEnemies.splice(j, 1);
                  setScore(s => s + 100);
                }
                break;
              }
            }
          }
          return newEnemies;
        });
        return remaining;
      });

      // Check collisions: enemies vs player
      if (activePowerUp !== 'invincible' && activePowerUp !== 'invisible') {
        setEnemies(prevEnemies => {
          for (const enemy of prevEnemies) {
            const dx = playerPos.x - enemy.x;
            const dy = playerPos.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 5) {
              if (activePowerUp === 'shield') {
                setActivePowerUp(null);
                return prevEnemies.filter(e => e !== enemy);
              } else {
                setPlayerHealth(h => {
                  const newHealth = h - 1;
                  if (newHealth <= 0) {
                    setGameState('gameover');
                  }
                  return newHealth;
                });
                return prevEnemies.filter(e => e !== enemy);
              }
            }
          }
          return prevEnemies;
        });
      }

      // Check power-up collection
      setPowerUps(prevPowerUps => {
        for (const powerUp of prevPowerUps) {
          const dx = playerPos.x - powerUp.x;
          const dy = playerPos.y - powerUp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 4) {
            setActivePowerUp(powerUp.type);
            setPowerUpEndTime(Date.now() + POWERUP_DURATION);
            return prevPowerUps.filter(p => p !== powerUp);
          }
        }
        return prevPowerUps;
      });

      // Check power-up expiration
      if (activePowerUp && Date.now() > powerUpEndTime) {
        setActivePowerUp(null);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, playerPos.x, playerPos.y, playerAngle, activePowerUp, powerUpEndTime, obstacles]);

  // Reset when closed
  useEffect(() => {
    if (!isExpanded) {
      setGameState('idle');
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, [isExpanded]);

  const getPowerUpIcon = (type: string) => {
    switch(type) {
      case 'size': return '🔰';
      case 'invincible': return '⭐';
      case 'shield': return '🛡️';
      case 'invisible': return '👻';
      default: return '✨';
    }
  };

  const getPowerUpColor = (type: string) => {
    switch(type) {
      case 'size': return 'text-yellow-400';
      case 'invincible': return 'text-purple-400';
      case 'shield': return 'text-blue-400';
      case 'invisible': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  // 渲染坦克的函数（经典像素风格）
  const renderTank = (isPlayer: boolean, angle: number, size: number) => {
    const color = isPlayer ? (
      activePowerUp === 'invincible' ? '#a855f7' :
      activePowerUp === 'shield' ? '#3b82f6' :
      '#22c55e'
    ) : '#ef4444';
    
    const borderColor = isPlayer ? '#86efac' : '#fca5a5';
    
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ 
        transform: `rotate(${angle}deg)`,
        filter: activePowerUp === 'invincible' ? 'drop-shadow(0 0 8px #a855f7)' : 'drop-shadow(0 0 4px rgba(0,0,0,0.5))'
      }}>
        {/* 坦克履带 */}
        <rect x="4" y="2" width="6" height="28" fill={color} stroke={borderColor} strokeWidth="1" />
        <rect x="22" y="2" width="6" height="28" fill={color} stroke={borderColor} strokeWidth="1" />
        
        {/* 履带纹理 */}
        <line x1="4" y1="5" x2="10" y2="5" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="4" y1="10" x2="10" y2="10" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="4" y1="15" x2="10" y2="15" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="4" y1="20" x2="10" y2="20" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="4" y1="25" x2="10" y2="25" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        
        <line x1="22" y1="5" x2="28" y2="5" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="10" x2="28" y2="10" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="15" x2="28" y2="15" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="20" x2="28" y2="20" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="25" x2="28" y2="25" stroke={borderColor} strokeWidth="1" opacity="0.5" />
        
        {/* 坦克车体 */}
        <rect x="8" y="6" width="16" height="20" fill={color} stroke={borderColor} strokeWidth="1.5" />
        
        {/* 炮塔 */}
        <rect x="12" y="10" width="8" height="12" fill={color} stroke={borderColor} strokeWidth="1.5" />
        
        {/* 炮管 */}
        <rect x="14" y="0" width="4" height="10" fill={color} stroke={borderColor} strokeWidth="1.5" />
        
        {/* 炮管加强 */}
        <rect x="15" y="1" width="2" height="9" fill={borderColor} opacity="0.3" />
        
        {/* 车体细节 */}
        <circle cx="16" cy="16" r="3" fill={borderColor} opacity="0.4" />
        <rect x="10" y="8" width="12" height="2" fill={borderColor} opacity="0.3" />
        <rect x="10" y="22" width="12" height="2" fill={borderColor} opacity="0.3" />
      </svg>
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center select-none bg-slate-900/50">
      {gameState === 'idle' && (
        <div className="text-center z-10 p-4">
          <Crosshair size={isExpanded ? 64 : 48} className="mx-auto text-green-400 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-2">坦克大战</h3>
          <p className="text-xs text-slate-400 mb-6">WASD移动 · 自动射击</p>
          {isExpanded && (
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              开始战斗
            </button>
          )}
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="absolute top-4 left-4 text-green-400 font-mono text-xl z-20 font-bold flex items-center gap-4">
            <span>分数: {score}</span>
            <span className="text-red-400">❤️ × {playerHealth}</span>
            {activePowerUp && (
              <span className={`${getPowerUpColor(activePowerUp)} animate-pulse`}>
                {getPowerUpIcon(activePowerUp)}
              </span>
            )}
          </div>
          
          <div 
            ref={canvasRef}
            className="relative bg-[#0a0a0a] border-2 border-green-500/30"
            style={{ 
              width: `${CANVAS_SIZE}px`,
              height: `${CANVAS_SIZE}px`
            }}
          >
            {/* Grid background */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(57,255,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Obstacles */}
            {obstacles.map((obs, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${obs.x}%`,
                  top: `${obs.y}%`,
                  width: `${obs.width}%`,
                  height: `${obs.height}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {obs.type === 'wall' ? (
                  // 墙壁 - 砖块纹理
                  <div className="w-full h-full bg-amber-900 border border-amber-700" style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(180,83,9,0.3) 50%, transparent 50%), linear-gradient(rgba(180,83,9,0.3) 50%, transparent 50%)',
                    backgroundSize: '8px 8px',
                    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)'
                  }} />
                ) : (
                  // 石头 - 岩石纹理
                  <div className="w-full h-full bg-gray-600 border border-gray-500 rounded" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(156,163,175,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(75,85,99,0.4) 0%, transparent 50%)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)'
                  }} />
                )}
              </div>
            ))}

            {/* Power-ups */}
            {powerUps.map((p, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'
                }}
              >
                {getPowerUpIcon(p.type)}
              </div>
            ))}

            {/* Bullets */}
            {bullets.map((b, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`w-2 h-2 rounded-full ${b.isPlayer ? 'bg-yellow-400' : 'bg-red-400'}`} style={{
                  boxShadow: b.isPlayer ? '0 0 8px #facc15, 0 0 4px #fef08a' : '0 0 8px #ef4444, 0 0 4px #fca5a5'
                }} />
              </div>
            ))}

            {/* Enemies */}
            {enemies.map((e, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${e.x}%`,
                  top: `${e.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {renderTank(false, e.angle, 20)}
              </div>
            ))}

            {/* Player tank */}
            {(activePowerUp !== 'invisible') && (
              <div
                className="absolute"
                style={{
                  left: `${playerPos.x}%`,
                  top: `${playerPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: activePowerUp === 'invisible' ? 0.3 : 1
                }}
              >
                {renderTank(true, playerAngle, TANK_SIZE)}
              </div>
            )}
          </div>

          <div className="mt-4 text-slate-400 text-sm font-mono">
            使用 WASD 或 方向键 移动坦克 · 可破坏石头障碍
          </div>
        </>
      )}

      {gameState === 'gameover' && (
        <div className="text-center z-10 bg-black/80 p-10 rounded-2xl border border-red-500/30 backdrop-blur-md shadow-2xl animate-fadeUp">
          <Trophy size={64} className="mx-auto text-red-400 mb-6" />
          <h3 className="text-3xl font-bold text-white mb-2">战斗结束</h3>
          <div className="text-6xl font-mono text-green-400 mb-8 font-bold">{score}</div>
          <button 
            onClick={startGame}
            className="flex items-center gap-2 mx-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-600 hover:border-green-500"
          >
            <RotateCcw size={20} /> 再战一次
          </button>
        </div>
      )}
    </div>
  );
};

// --- Game 2: Core Sync (Memory) ---
const CoreSync: React.FC<GameProps> = ({ isExpanded }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState('READY?');
  
  // Ref to track if component is mounted/active to prevent async state updates on unmount
  const isActiveRef = useRef(false);

  const pads = [0, 1, 2, 3];
  const colors = [
    'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] border-red-300', 
    'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] border-blue-300', 
    'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)] border-green-300', 
    'bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] border-purple-300'
  ];

  const startGame = () => {
    setSequence([]);
    setPlayerInput([]);
    setLevel(1);
    setIsPlaying(true);
    setMessage('WATCH');
    isActiveRef.current = true;
    addToSequence([]);
  };

  const addToSequence = (currentSeq: number[]) => {
    if (!isActiveRef.current) return;
    const next = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, next];
    setSequence(newSeq);
    setPlayerInput([]);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    if (!isActiveRef.current) return;
    setIsShowingSequence(true);
    setMessage('SYNCING...');
    
    // Initial delay
    await new Promise(resolve => setTimeout(resolve, 800));

    for (let i = 0; i < seq.length; i++) {
      if (!isActiveRef.current) return; // Abort if closed
      setActivePad(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActivePad(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (isActiveRef.current) {
      setIsShowingSequence(false);
      setMessage('REPEAT');
    }
  };

  const handlePadClick = (index: number) => {
    if (!isPlaying || isShowingSequence) return;

    // Visual feedback
    setActivePad(index);
    setTimeout(() => setActivePad(null), 200);

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);

    // Check correctness
    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      setIsPlaying(false);
      setMessage(`FAIL. LVL ${level}`);
      return;
    }

    if (newInput.length === sequence.length) {
      setLevel(l => l + 1);
      setMessage('CORRECT');
      setTimeout(() => addToSequence(sequence), 1000);
    }
  };

  // Cleanup effect
  useEffect(() => {
    isActiveRef.current = isExpanded;
    if (!isExpanded) {
      setIsPlaying(false);
      setIsShowingSequence(false);
      setActivePad(null);
    }
    return () => {
      isActiveRef.current = false;
    };
  }, [isExpanded]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 relative">
      {!isPlaying && !isExpanded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <Cpu size={48} className="text-blue-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white">CORE SYNC</h3>
          <p className="text-xs text-slate-400">Memory Matrix</p>
        </div>
      )}

      {(!isPlaying && isExpanded) ? (
        <div className="text-center z-10 animate-fadeUp">
           <Cpu size={64} className="text-blue-400 mb-6 mx-auto" />
           <h3 className="text-3xl font-bold text-white mb-2">{message === 'READY?' ? 'CORE SYNC' : 'SYNC FAILED'}</h3>
           {message !== 'READY?' && <div className="text-blue-400 font-mono mb-6 text-xl">{message}</div>}
           <button 
              onClick={startGame}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {message === 'READY?' ? 'INITIALIZE' : 'REBOOT SYSTEM'}
            </button>
        </div>
      ) : (
        isExpanded && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="mb-8 font-mono text-blue-400 text-2xl tracking-[0.5em] font-bold animate-pulse">{message}</div>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {pads.map(i => (
                <div
                  key={i}
                  onMouseDown={() => handlePadClick(i)}
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 transition-all duration-100 cursor-pointer flex items-center justify-center
                    ${activePad === i 
                      ? `${colors[i]} scale-95 brightness-110` 
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500 opacity-80 hover:opacity-100'}`}
                />
              ))}
            </div>
            <div className="mt-8 text-slate-500 font-mono text-sm tracking-widest">CURRENT LEVEL: <span className="text-white">{level}</span></div>
          </div>
        )
      )}
    </div>
  );
};

// --- Game 3: Snake (Replaced Data Stream) ---
const SnakeGame: React.FC<GameProps> = ({ isExpanded }) => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20; // Used for calculation relative to grid, visual handled by CSS grid
  const INITIAL_SPEED = 150;

  // Game State
  const [snake, setSnake] = useState<{x: number, y: number}[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<{x: number, y: number}>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<{x: number, y: number}>({ x: 0, y: -1 }); // Moving UP
  const [nextDirection, setNextDirection] = useState<{x: number, y: number}>({ x: 0, y: -1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameIntervalRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check collision with snake
      const isOnSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood(generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]));
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
        break;
    }
  }, [isPlaying, direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const changeDirection = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!isPlaying) return;
    if (dir === 'UP' && direction.y === 0) setNextDirection({ x: 0, y: -1 });
    if (dir === 'DOWN' && direction.y === 0) setNextDirection({ x: 0, y: 1 });
    if (dir === 'LEFT' && direction.x === 0) setNextDirection({ x: -1, y: 0 });
    if (dir === 'RIGHT' && direction.x === 0) setNextDirection({ x: 1, y: 0 });
  };

  // Game Loop
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameIntervalRef.current = window.setInterval(() => {
        setDirection(nextDirection);
        
        setSnake(prevSnake => {
          const head = prevSnake[0];
          const newHead = {
            x: head.x + nextDirection.x,
            y: head.y + nextDirection.y
          };

          // Check Wall Collision
          if (
            newHead.x < 0 || 
            newHead.x >= GRID_SIZE || 
            newHead.y < 0 || 
            newHead.y >= GRID_SIZE ||
            // Check Self Collision
            prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
          ) {
            setIsGameOver(true);
            setIsPlaying(false);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          // Check Food
          if (newHead.x === food.x && newHead.y === food.y) {
            setScore(s => s + 10);
            setFood(generateFood(newSnake));
            // Grow: don't pop tail
          } else {
            // Move: pop tail
            newSnake.pop();
          }

          return newSnake;
        });

      }, Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5)); // Speed up
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isPlaying, isGameOver, nextDirection, food, score, generateFood]);

  // Cleanup on close
  useEffect(() => {
    if (!isExpanded) {
      setIsPlaying(false);
      setIsGameOver(false);
    }
  }, [isExpanded]);

  return (
    <div className="w-full h-full relative bg-[#050505] flex flex-col items-center justify-center select-none">
      {/* Title State */}
      {!isPlaying && !isGameOver && !isExpanded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <Activity size={48} className="text-[#39ff14] mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white">CYBER SNAKE</h3>
          <p className="text-xs text-slate-400">Data Consumption</p>
        </div>
      )}

      {/* Expanded Menu State */}
      {isExpanded && !isPlaying && !isGameOver && (
        <div className="text-center z-20 animate-fadeUp">
           <Activity size={64} className="text-[#39ff14] mb-6 mx-auto" />
           <h3 className="text-3xl font-bold text-white mb-2">CYBER SNAKE</h3>
           <p className="text-slate-400 mb-8">Consume data packets. Do not crash.</p>
           <button 
              onClick={startGame}
              className="flex items-center gap-2 px-10 py-3 bg-[#39ff14] hover:bg-[#32d712] text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] mx-auto"
            >
              <Play size={20} fill="currentColor" /> START
            </button>
        </div>
      )}

      {/* Game Over State - FIXED: Absolute Overlay for Centering */}
      {isGameOver && isExpanded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="text-center p-8 rounded-2xl border border-red-500/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(239,68,68,0.3)] transform scale-100">
               <h3 className="text-3xl font-bold text-red-500 mb-2 tracking-widest">SYSTEM CRASH</h3>
               <div className="text-4xl font-mono text-white mb-6">SCORE: <span className="text-[#39ff14]">{score}</span></div>
               <button 
                  onClick={startGame}
                  className="px-10 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/40"
                >
                  REBOOT SYSTEM
                </button>
            </div>
        </div>
      )}

      {/* Game Grid */}
      {isExpanded && (isPlaying || isGameOver) && (
        <div className="flex flex-col items-center gap-4">
           {/* Header */}
           <div className="flex justify-between w-full max-w-[400px] text-mono text-[#39ff14] font-bold text-xl mb-2 px-4">
              <span>SCORE: {score}</span>
           </div>

           {/* Board */}
           <div 
             className="relative bg-[#0a0a0a] border-2 border-[#1a1a1a] shadow-[0_0_30px_rgba(57,255,20,0.1)]"
             style={{ 
               width: 'min(80vw, 400px)', 
               height: 'min(80vw, 400px)',
               display: 'grid',
               gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
               gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
             }}
           >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                
                const isSnakeBody = snake.some(s => s.x === x && s.y === y);
                const isSnakeHead = snake[0].x === x && snake[0].y === y;
                const isFood = food.x === x && food.y === y;

                return (
                  <div key={i} className="w-full h-full border-[0.5px] border-[#111] relative">
                     {isSnakeBody && (
                       <div className={`w-full h-full bg-[#39ff14] ${isSnakeHead ? 'shadow-[0_0_10px_#39ff14] z-10' : 'opacity-80'}`}></div>
                     )}
                     {isFood && (
                       <div className="w-full h-full bg-red-500 rounded-full scale-75 animate-pulse shadow-[0_0_10px_red]"></div>
                     )}
                  </div>
                );
              })}
           </div>

           {/* On-screen Controls (Mobile Friendly) */}
           <div className="grid grid-cols-3 gap-2 mt-4">
              <div></div>
              <button 
                onPointerDown={(e) => { e.preventDefault(); changeDirection('UP'); }}
                className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center active:bg-[#39ff14] active:text-black transition-colors"
              >
                <ChevronUp size={32} />
              </button>
              <div></div>
              <button 
                onPointerDown={(e) => { e.preventDefault(); changeDirection('LEFT'); }}
                className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center active:bg-[#39ff14] active:text-black transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); changeDirection('DOWN'); }}
                className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center active:bg-[#39ff14] active:text-black transition-colors"
              >
                <ChevronDown size={32} />
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); changeDirection('RIGHT'); }}
                className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center active:bg-[#39ff14] active:text-black transition-colors"
              >
                <ChevronRight size={32} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Card Wrapper with Portal ---
const GameCardWrapper: React.FC<{
  children: (props: GameProps) => React.ReactNode;
}> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    if (isExpanded) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded]);

  return (
    <>
      {/* Normal State: The Card Placeholder */}
      <div 
        className="relative h-64 rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:border-slate-600 group"
      >
        <div className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
          {children({ isExpanded: false })}
        </div>

        <button 
          onClick={() => setIsExpanded(true)}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all z-30"
          title="Maximize"
        >
          <Maximize2 size={16} />
        </button>

        <div className="absolute top-3 right-10 text-[10px] uppercase font-mono text-slate-500 bg-black/40 px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Click to Play
        </div>
      </div>

      {/* Expanded State: Portal to Body */}
      {isExpanded && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="w-full h-full md:w-[95%] md:h-[90%] relative bg-[#050505] md:rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all z-50 border border-red-500/30"
              title="Close (ESC)"
            >
              <Minimize2 size={24} />
            </button>

            {/* Game Content */}
            {children({ isExpanded: true })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export const GameModules: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-6xl z-20 px-4">
      <GameCardWrapper>
        {(props) => <TankBattle {...props} />}
      </GameCardWrapper>
      <GameCardWrapper>
        {(props) => <CoreSync {...props} />}
      </GameCardWrapper>
      <GameCardWrapper>
        {(props) => <SnakeGame {...props} />}
      </GameCardWrapper>
    </div>
  );
};
