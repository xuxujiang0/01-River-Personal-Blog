import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-800/50 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Copyright */}
          <p className="text-gray-500 text-sm font-mono">
            © {currentYear} River.Life. All rights reserved.
          </p>
          
          {/* ICP 备案号 */}
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-sm font-mono hover:text-[#39ff14] transition-colors duration-300"
          >
            粤ICP备2025507846号-1
          </a>
        </div>
      </div>
    </footer>
  );
};
