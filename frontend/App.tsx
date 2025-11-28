
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { BackToTop } from './components/BackToTop';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { WriteBlog } from './pages/WriteBlog';
import { Works } from './pages/Works';
import { WriteProject } from './pages/WriteProject';
import { About } from './pages/About';
import { PageRoute } from './types';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="bg-[#050505] min-h-screen text-slate-300 font-sans selection:bg-[#39ff14] selection:text-black relative overflow-x-hidden">
          
          {/* Header */}
          <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/90 backdrop-blur-sm border-b border-gray-900">
            <Navbar />
          </header>
          
          {/* Main Content */}
          <main className="pt-24 animate-fadeIn min-h-screen relative flex flex-col z-10">
            <Routes>
              <Route path={PageRoute.HOME} element={<Home />} />
              <Route path={PageRoute.BLOG} element={<Blog />} />
              <Route path={PageRoute.WRITE} element={<WriteBlog />} />
              <Route path={PageRoute.WORKS} element={<Works />} />
              <Route path={PageRoute.WRITE_WORK} element={<WriteProject />} />
              <Route path={PageRoute.ABOUT} element={<About />} />
              <Route path="*" element={<Navigate to={PageRoute.HOME} replace />} />
            </Routes>
          </main>

          {/* Global Overlays - Rendered at root to avoid z-index/stacking context issues */}
          <AuthModal />
          <BackToTop />
        </div>
        
        {/* Global Animations */}
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeUp {
            animation: fadeUp 0.8s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
