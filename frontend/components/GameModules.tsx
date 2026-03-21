
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, RotateCcw, Zap, Cpu, Activity, Trophy, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, Shield, Eye, EyeOff, Crosshair, Plane, Gamepad2 } from 'lucide-react';
import { TankGame } from './TankGame';

// --- Shared Types ---
interface GameProps {
  isExpanded: boolean;
}

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
          <Gamepad2 size={48} className="text-[#39ff14] mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white">贪吃蛇</h3>
          <p className="text-xs text-slate-400">经典怀旧游戏</p>
        </div>
      )}

      {/* Expanded Menu State */}
      {isExpanded && !isPlaying && !isGameOver && (
        <div className="text-center z-20 animate-fadeUp">
           <Gamepad2 size={64} className="text-[#39ff14] mb-6 mx-auto" />
           <h3 className="text-3xl font-bold text-white mb-2">贪吃蛇</h3>
           <p className="text-slate-400 mb-8">控制方向吃掉食物，不要撞墙哦。</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-w-4xl z-20 px-4">
      <GameCardWrapper>
        {(props) => <TankGame {...props} />}
      </GameCardWrapper>
      <GameCardWrapper>
        {(props) => <SnakeGame {...props} />}
      </GameCardWrapper>
    </div>
  );
};
