import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PageRoute } from '../types';
import { useAppStore } from '../store';
import { Menu, X, LogIn, User as UserIcon } from 'lucide-react';
import { getAvatarUrl } from '../utils/avatar';
import { AvatarModal } from './AvatarModal';

// Spider Animation Component
const SpiderAnimation = () => (
  <div className="absolute top-10 left-8 pointer-events-none z-0">
    {/* Thread Container - Animates Height */}
    <div className="w-[1px] bg-slate-600/80 mx-auto animate-spider-drop origin-top relative shadow-[0_0_2px_rgba(255,255,255,0.5)]">
       {/* Spider positioned at the bottom of the thread */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[28%]">
          {/* Detailed Spider SVG */}
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="drop-shadow-lg filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
             {/* Legs (8 legs) - Upper */}
             <path d="M20 18 L6 10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
             <path d="M20 18 L34 10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
             
             {/* Legs - Middle Upper */}
             <path d="M20 20 L4 18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
             <path d="M20 20 L36 18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

             {/* Legs - Middle Lower */}
             <path d="M20 22 L5 28" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
             <path d="M20 22 L35 28" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
             
             {/* Legs - Lower */}
             <path d="M20 24 L10 34" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
             <path d="M20 24 L30 34" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

             {/* Silk Connection (Mouth) */}
             <path d="M20 14 L20 18" stroke="#cbd5e1" strokeWidth="1" />

             {/* Head */}
             <circle cx="20" cy="20" r="4" fill="#0f172a" stroke="#39ff14" strokeWidth="1" />
             
             {/* Abdomen */}
             <ellipse cx="20" cy="27" rx="6" ry="8" fill="#0f172a" stroke="#39ff14" strokeWidth="1" />
             
             {/* Eyes (Glowing) */}
             <circle cx="19" cy="21" r="1" fill="#ef4444" className="animate-pulse" />
             <circle cx="21" cy="21" r="1" fill="#ef4444" className="animate-pulse" />
             <circle cx="18" cy="20" r="0.5" fill="#ef4444" />
             <circle cx="22" cy="20" r="0.5" fill="#ef4444" />
          </svg>
       </div>
    </div>
    <style>{`
      @keyframes spiderDrop {
         0% { height: 15px; }
         50% { height: 100px; }
         100% { height: 15px; }
      }
      .animate-spider-drop {
         animation: spiderDrop 5s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export const Navbar: React.FC = () => {
  const { user, logout, openAuthModal, updateAvatar } = useAppStore();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);

  const navItems = [
    { label: '首页', path: PageRoute.HOME },
    { label: '博客', path: PageRoute.BLOG },
    { label: '作品', path: PageRoute.WORKS },
    { label: '关于', path: PageRoute.ABOUT },
  ];

  return (
    <>
      <nav className="relative w-full h-20 px-6 md:px-12 flex items-center">
        {/* Logo Section - Left */}
        <div className="relative flex items-center h-full mr-8">
          <span className="text-2xl md:text-3xl font-mono font-extrabold tracking-tight text-white select-none z-20">
            River<span className="text-[#39ff14]">.Life</span>
          </span>
          {/* Spider Animation */}
          <SpiderAnimation />
        </div>

        {/* Right Side Container (Menu + Auth) */}
        <div className="hidden md:flex items-center ml-auto gap-12">
          {/* Desktop Menu - Aligned Right */}
          <div className="flex items-center space-x-10 h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm md:text-base font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#39ff14] shadow-[0_0_8px_#39ff14]"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Auth / User Section - Aligned Right */}
          <div className="flex items-center border-l border-gray-800 pl-8 h-8">
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-3 group relative cursor-pointer">
                  <div className="text-right hidden lg:block">
                    <div className="text-gray-200 text-sm font-mono leading-none">{user.nickname || user.username || user.name}</div>
                    <div className="text-[10px] text-[#39ff14] mt-1">
                      {user.role === 'admin' ? '管理员' : user.role === 'user' ? '普通用户' : user.role?.toUpperCase()}
                    </div>
                  </div>
                  <img src={getAvatarUrl(user)} alt="avatar" className="w-9 h-9 rounded bg-gray-800 border border-gray-700 object-cover" />
                  
                  <div className="absolute top-full right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out z-50">
                    <button 
                      onClick={() => setAvatarModalOpen(true)} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors duration-150 flex items-center gap-2"
                    >
                      <UserIcon size={14} />
                      修改头像
                    </button>
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors duration-150"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <LogIn size={16} />
                <span>登录</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle (Right aligned) */}
        <button className="md:hidden text-gray-300 z-10 ml-auto" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 w-full bg-[#0a0a0a] border-b border-gray-800 z-40 p-4 md:hidden animate-fadeIn">
           <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium py-3 px-4 rounded border-l-2 ${isActive ? 'bg-white/5 text-[#39ff14] border-[#39ff14]' : 'text-gray-400 border-transparent'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="border-t border-gray-800 pt-4 mt-2">
                {user ? (
                   <div className="px-4">
                      <div className="flex items-center gap-3 mb-4">
                         <img src={getAvatarUrl(user)} className="w-8 h-8 rounded"/>
                         <span className="text-white">{user.nickname || user.username || user.name}</span>
                      </div>
                      <button onClick={logout} className="text-red-400 w-full text-left">退出登录</button>
                   </div>
                ) : (
                   <button onClick={() => { openAuthModal(); setMobileMenuOpen(false); }} className="text-[#3b82f6] text-left px-4 py-2 font-bold w-full">登录账户</button>
                )}
              </div>
           </div>
        </div>
      )}
      
      {/* Avatar Modal */}
      <AvatarModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatar={user ? getAvatarUrl(user) : undefined}
        onSuccess={(newAvatarUrl) => updateAvatar(newAvatarUrl)}
      />
    </>
  );
};