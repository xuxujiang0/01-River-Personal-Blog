import React, { useState } from 'react';
import { X, Github, MessageCircle, Lock, User } from 'lucide-react';
import { useAppStore } from '../store';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAppStore();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('请输入账号和密码');
      return;
    }
    
    setIsLoading(true);
    try {
      await login('admin', { username, password });
      closeAuthModal();
      setShowAdminForm(false);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWechatLogin = async () => {
    setIsLoading(true);
    try {
      await login('wechat');
      closeAuthModal();
    } catch (error) {
      console.error('微信登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await login('github');
      closeAuthModal();
    } catch (error) {
      console.error('GitHub登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={() => {
            closeAuthModal();
            setShowAdminForm(false);
            setUsername('');
            setPassword('');
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-white font-mono tracking-wider">ACCESS CONTROL</h2>
           <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
             {showAdminForm ? 'Admin Login' : 'Identify Yourself'}
           </p>
        </div>

        {!showAdminForm ? (
          <div className="space-y-4">
            <button
              onClick={handleWechatLogin}
              disabled={isLoading}
              className="w-full bg-[#07C160] hover:bg-[#06ad56] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-colors font-bold shadow-lg shadow-green-900/20"
            >
              <MessageCircle size={20} />
              <span>{isLoading ? '登录中...' : '微信一键登录'}</span>
            </button>
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full bg-[#24292e] hover:bg-[#2f363d] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-colors font-bold shadow-lg shadow-gray-900/20"
            >
              <Github size={20} />
              <span>{isLoading ? '登录中...' : 'GitHub 登录'}</span>
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
              onClick={() => setShowAdminForm(true)}
              className="w-full border border-gray-800 hover:border-gray-600 bg-gray-900/30 text-gray-400 hover:text-white py-2 rounded-lg text-xs transition-colors"
            >
              管理员入口
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">账号</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入管理员账号"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/30"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAdminForm(false);
                setUsername('');
                setPassword('');
              }}
              className="w-full border border-gray-800 hover:border-gray-600 bg-gray-900/30 text-gray-400 hover:text-white py-2 rounded-lg text-xs transition-colors"
            >
              返回
            </button>
          </form>
        )}
      </div>
    </div>
  );
};