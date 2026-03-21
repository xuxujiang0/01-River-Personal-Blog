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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TankGameEngine | null>(null);
  
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'levelup'>('start');
  const [stats, setStats] = useState({ level: 1, enemies: 0, hp: 100 });
  const [uiStyle, setUiStyle] = useState<React.CSSProperties>({ width: '100%', height: '100%', left: 0, top: 0 });
  const [canvasLayout, setCanvasLayout] = useState({ scaledWidth: 1280, scaledHeight: 720, logicalLeft: 0, logicalTop: 0 });

  useEffect(() => {
    const updateUiLayout = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const isPortrait = clientHeight > clientWidth;
        
        if (isPortrait) {
          setUiStyle({
            transform: 'rotate(90deg)',
            width: `${clientHeight}px`,
            height: `${clientWidth}px`,
            left: `${(clientWidth - clientHeight) / 2}px`,
            top: `${(clientHeight - clientWidth) / 2}px`,
          });
        } else {
          setUiStyle({
            transform: 'none',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          });
        }
      }
    };

    updateUiLayout();
    window.addEventListener('resize', updateUiLayout);
    return () => window.removeEventListener('resize', updateUiLayout);
  }, [isExpanded]);

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
        onStatsChange: (newStats: any) => setStats(newStats),
        onResize: (layout: any) => setCanvasLayout(layout)
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

  const handleStart = async () => {
    try {
      if (containerRef.current && !document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
    if (engineRef.current) {
      engineRef.current.initGame();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="tank-game-container w-full h-full relative bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden" 
      style={{ 
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        overscrollBehavior: 'none'
      }}
    >
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
            className="block bg-black"
            style={{ 
              touchAction: 'none',
              boxSizing: 'content-box'
            }}
          />

          {/* UI Layer */}
          <div 
            className="absolute pointer-events-none"
            style={uiStyle}
          >
            {/* 外部状态栏 (位于屏幕底部边界上，完全左对齐) */}
            {(gameState === 'playing' || gameState === 'levelup') && (
              <div 
                className="absolute flex justify-start items-center px-4 py-2 gap-6"
                style={{ 
                  bottom: 0, 
                  left: 0, 
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                }}
              >
                <div className="text-white text-sm md:text-base font-bold drop-shadow-md">
                  关卡: <span className="text-yellow-400">{stats.level}</span>
                </div>
                <div className="text-white text-sm md:text-base font-bold drop-shadow-md">
                  敌军剩余: <span className="text-red-400">{stats.enemies}</span>
                </div>
                <div className="text-white text-sm md:text-base font-bold drop-shadow-md">
                  生命: <span className="text-green-400">{stats.hp}</span>
                </div>
              </div>
            )}

            {/* Start Screen */}
              {gameState === 'start' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black/80 p-8 md:p-10 rounded-xl border-2 border-green-500 pointer-events-auto shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                  <TankIcon size={64} className="text-green-500 mb-6 mx-auto" />
                  <h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-4 tracking-widest uppercase">坦克大战</h1>
                  <p className="text-slate-300 mb-8 text-sm md:text-base">WASD 或 方向键移动，空格键射击<br/>移动端：左半屏移动，右半屏瞄准射击</p>
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
          </div>
        </>
      )}
    </div>
  );
};
