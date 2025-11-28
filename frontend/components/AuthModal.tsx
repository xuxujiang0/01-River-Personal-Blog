import React from 'react';
import { X, Github, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAppStore();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        onClick={closeAuthModal}
        aria-hidden="true"
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-[#0d0d0d] border border-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fadeIn">
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-white font-mono tracking-wider">ACCESS CONTROL</h2>
           <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Identify Yourself</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => { login('wechat'); closeAuthModal(); }}
            className="w-full bg-[#07C160] hover:bg-[#06ad56] text-white py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-colors font-bold shadow-lg shadow-green-900/20"
          >
            <MessageCircle size={20} />
            <span>微信一键登录</span>
          </button>
          <button
            onClick={() => { login('github'); closeAuthModal(); }}
            className="w-full bg-[#24292e] hover:bg-[#2f363d] text-white py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-colors font-bold shadow-lg shadow-gray-900/20"
          >
            <Github size={20} />
            <span>GitHub 登录</span>
          </button>
          
          <div className="relative my-8">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="px-2 bg-[#0d0d0d] text-gray-600">Restricted Area</span>
             </div>
          </div>

          <button
            onClick={() => { login('admin'); closeAuthModal(); }}
            className="w-full border border-gray-800 hover:border-gray-600 bg-gray-900/30 text-gray-400 hover:text-white py-2 rounded-lg text-xs transition-colors"
          >
            管理员入口
          </button>
        </div>
      </div>
    </div>
  );
};