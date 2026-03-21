import React, { useEffect, useRef, useState } from 'react';
import { TankGameEngine } from './engine';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair } from 'lucide-react';

const TankIcon = ({ size = 48, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    {/* 左履带 */}
    <rect x="3" y="3" width="4" height="18" rx="1" />
    {/* 右履带 */}
    <rect x="17" y="3" width="4" height="18" rx="1" />
    {/* 车身 */}
    <path d="M7 6h10v12H7z" />
    {/* 炮塔 */}
    <circle cx="12" cy="13" r="4" fill="#050505" stroke="currentColor" strokeWidth="2" />
    {/* 炮管 */}
    <rect x="11" y="2" width="2" height="10" />
  </svg>
);

interface TankGameProps {
  isExpanded: boolean;
}

export const TankGame: React.FC<TankGameProps> = ({ isExpanded }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TankGameEngine | null>(null);
  
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'levelup'>('start');
  const [stats, setStats] = useState({ level: 1, enemies: 0, hp: 100 });

  useEffect(() => {
    if (!isExpanded) {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      setGameState('start');
      return;
    }

    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new TankGameEngine(canvasRef.current, {
        onStateChange: (state: any) => setGameState(state),
        onStatsChange: (newStats: any) => setStats(newStats)
      });
      // We don't auto-start, wait for user to click start
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [isExpanded]);

  const handleStart = () => {
    if (engineRef.current) {
      engineRef.current.initGame();
    }
  };

  const simulateKeyDown = (key: string) => {
    if (engineRef.current && gameState === 'playing') {
      engineRef.current.input.keys[key] = true;
      if (key === ' ' && engineRef.current.player && engineRef.current.player.active) {
        engineRef.current.player.shoot(engineRef.current.bullets);
      }
    }
  };

  const simulateKeyUp = (key: string) => {
    if (engineRef.current) {
      engineRef.current.input.keys[key] = false;
    }
  };

  return (
    <div className="w-full h-full relative bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Title State (Not Expanded) */}
      {!isExpanded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <TankIcon size={48} className="text-green-500 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white">坦克大战</h3>
          <p className="text-xs text-slate-400">经典射击游戏</p>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <>
          {/* Canvas */}
          <canvas 
            ref={canvasRef} 
            className="block bg-black w-full h-full"
          />

          {/* UI Layer */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between">
            
            {/* Score Board */}
            {(gameState === 'playing' || gameState === 'levelup') && (
              <div className="p-4 text-white text-lg md:text-xl font-bold drop-shadow-md z-10">
                关卡: <span className="text-yellow-400">{stats.level}</span> | 
                敌军剩余: <span className="text-red-400">{stats.enemies}</span> | 
                生命: <span className="text-green-400">{stats.hp}</span>
              </div>
            )}

            {/* Start Screen */}
            {gameState === 'start' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black/80 p-8 md:p-10 rounded-xl border-2 border-green-500 pointer-events-auto shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                <TankIcon size={64} className="text-green-500 mb-6 mx-auto" />
                <h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-4 tracking-widest uppercase">坦克大战</h1>
                <p className="text-slate-300 mb-8 text-sm md:text-base">WASD 或 方向键移动，空格键射击</p>
                <button 
                  onClick={handleStart}
                  className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition-colors text-lg"
                >
                  开始游戏
                </button>
              </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black/90 p-8 md:p-10 rounded-xl border-2 border-red-500 pointer-events-auto shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 tracking-widest">游戏结束</h1>
                <button 
                  onClick={handleStart}
                  className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors text-lg"
                >
                  重新开始
                </button>
              </div>
            )}

            {/* Level Up Screen */}
            {gameState === 'levelup' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black/80 p-8 md:p-10 rounded-xl border-2 border-yellow-500 pointer-events-auto shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-pulse">
                <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4 tracking-widest">关卡完成!</h1>
                <p className="text-slate-300 text-lg">下一关即将开始...</p>
              </div>
            )}

            {/* Mobile Controls */}
            {gameState === 'playing' && (
              <div className="p-4 flex justify-between items-end pointer-events-auto md:hidden opacity-70 hover:opacity-100 transition-opacity">
                {/* D-Pad */}
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); simulateKeyDown('w'); }}
                    onPointerUp={(e) => { e.preventDefault(); simulateKeyUp('w'); }}
                    onPointerLeave={(e) => { e.preventDefault(); simulateKeyUp('w'); }}
                    className="w-14 h-14 bg-slate-800/80 rounded-lg flex items-center justify-center active:bg-green-500 active:text-black transition-colors text-white border border-slate-600"
                  >
                    <ChevronUp size={28} />
                  </button>
                  <div></div>
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); simulateKeyDown('a'); }}
                    onPointerUp={(e) => { e.preventDefault(); simulateKeyUp('a'); }}
                    onPointerLeave={(e) => { e.preventDefault(); simulateKeyUp('a'); }}
                    className="w-14 h-14 bg-slate-800/80 rounded-lg flex items-center justify-center active:bg-green-500 active:text-black transition-colors text-white border border-slate-600"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); simulateKeyDown('s'); }}
                    onPointerUp={(e) => { e.preventDefault(); simulateKeyUp('s'); }}
                    onPointerLeave={(e) => { e.preventDefault(); simulateKeyUp('s'); }}
                    className="w-14 h-14 bg-slate-800/80 rounded-lg flex items-center justify-center active:bg-green-500 active:text-black transition-colors text-white border border-slate-600"
                  >
                    <ChevronDown size={28} />
                  </button>
                  <button 
                    onPointerDown={(e) => { e.preventDefault(); simulateKeyDown('d'); }}
                    onPointerUp={(e) => { e.preventDefault(); simulateKeyUp('d'); }}
                    onPointerLeave={(e) => { e.preventDefault(); simulateKeyUp('d'); }}
                    className="w-14 h-14 bg-slate-800/80 rounded-lg flex items-center justify-center active:bg-green-500 active:text-black transition-colors text-white border border-slate-600"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>

                {/* Shoot Button */}
                <button 
                  onPointerDown={(e) => { e.preventDefault(); simulateKeyDown(' '); }}
                  onPointerUp={(e) => { e.preventDefault(); simulateKeyUp(' '); }}
                  onPointerLeave={(e) => { e.preventDefault(); simulateKeyUp(' '); }}
                  className="w-20 h-20 bg-red-600/80 rounded-full flex items-center justify-center active:bg-red-500 active:scale-95 transition-all text-white border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] mb-2 mr-2"
                >
                  <Crosshair size={32} />
                </button>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};
