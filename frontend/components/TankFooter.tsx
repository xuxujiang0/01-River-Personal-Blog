import React from 'react';

export const TankFooter: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 overflow-hidden z-40 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full flex items-center">
        {/* The container moves from left to right infinitely */}
        <div className="animate-tank-scroll flex items-center w-full">
           {/* Tank SVG */}
           <div className="relative w-12 h-12 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform -scale-x-100">
                <path d="M2 12h2v3h16v-3h2v5H2v-5zm3-1h14v-2H5v2zm2-3h10V6H7v2z" />
                <rect x="14" y="5" width="6" height="2" className="animate-pulse" />
                <circle cx="6" cy="18" r="2" className="animate-spin" style={{ animationDuration: '2s' }} />
                <circle cx="12" cy="18" r="2" className="animate-spin" style={{ animationDuration: '2s' }} />
                <circle cx="18" cy="18" r="2" className="animate-spin" style={{ animationDuration: '2s' }} />
              </svg>
              {/* Dust particles effect behind tank */}
              <div className="absolute bottom-1 right-12 flex space-x-1">
                 <div className="w-1 h-1 bg-gray-500 rounded-full animate-ping delay-75"></div>
                 <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-ping delay-150"></div>
              </div>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes tankScroll {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(100vw); }
        }
        .animate-tank-scroll {
          animation: tankScroll 10s linear infinite;
        }
      `}</style>
    </div>
  );
};