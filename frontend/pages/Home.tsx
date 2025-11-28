
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageRoute } from '../types';
import { GameModules } from '../components/GameModules';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center relative px-4 pt-12 pb-12 w-full">
      {/* Background Decor */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl text-center space-y-6 animate-fadeUp">
        <h2 className="text-indigo-400 font-medium tracking-wider text-sm">Welcome to my living space</h2>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          品味 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">生活</span> 空间
          <br />
          {/* 连接 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">未来</span> 科技 */}
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-4">
          这是一个情感非常丰富的，有爱的，善良的，和蔼可亲的个人空间，希望你不会爱上我。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button 
            onClick={() => navigate(PageRoute.BLOG)}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
          >
            <span>阅读博客</span>
            <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => navigate(PageRoute.WORKS)}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium border border-slate-600 transition-all hover:scale-105"
          >
            查看作品
          </button>
        </div>
      </div>

      {/* Interactive Game Modules */}
      <GameModules />
    </div>
  );
};
