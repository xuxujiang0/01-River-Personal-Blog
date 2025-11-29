import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAppStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      window.toast?.error('请输入账号和密码');
      return;
    }
    
    setIsLoading(true);
    try {
      await login({ username, password });
      closeAuthModal();
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWechatLogin = async () => {
    // 移除微信登录功能
  };
  
  const handleQrcodeRefresh = async () => {
    // 移除微信登录功能
  };
  
  const handleQrcodeClose = () => {
    // 移除微信登录功能
  };

  const handleGithubLogin = async () => {
    // 移除GitHub登录功能
  };

  return (
    <>
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
            setUsername('');
            setPassword('');
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-white font-mono tracking-wider">River Blog</h2>
        </div>
        
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
          </form>
          
          {/* 注册入口 - 文本链接样式 */}
          <div className="mt-4 text-right">
            <button
              onClick={() => {
                closeAuthModal();
                navigate('/register');
              }}
              className="text-xs text-gray-400 hover:text-indigo-400 underline underline-offset-2 transition-colors"
              title="注册账号"
            >
              立即注册
            </button>
          </div>
      </div>
      </div>
    </>
  );
};