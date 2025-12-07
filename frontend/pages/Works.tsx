
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Loader2, PenTool, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { PageRoute } from '../types';

export const Works: React.FC = () => {
  const { projects, user, deleteProject } = useAppStore();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Calculate visibility
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, hasMore, projects.length]);

  const loadMoreProjects = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 1500);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = await window.toast?.confirm('确定要删除这个作品吗？', {
      title: '删除作品',
      confirmText: '确定删除',
      cancelText: '取消'
    });
    
    if (confirmed) {
      deleteProject(id);
      window.toast?.success('作品已删除');
    }
  };

  return (
    <div className="pt-8 pb-12 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">精选作品</h1>
          <p className="text-slate-400">从构思到落地，每一个项目都是对完美的追求。</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => navigate(PageRoute.WRITE_WORK)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/25"
          >
            <PenTool size={18} />
            <span>发布作品</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleProjects.map((project) => (
          <div 
            key={project.id} 
            className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="w-full aspect-video overflow-hidden relative bg-slate-900">
               <img 
                 src={project.image} 
                 alt={project.title} 
                 loading="lazy"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
               />
               
               {/* Overlay on Hover */}
               <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm z-30 pointer-events-none group-hover:pointer-events-auto">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-900 rounded-full hover:bg-indigo-400 hover:text-white transition-colors transform hover:scale-110">
                     <ExternalLink size={24} />
                  </a>
               </div>
            </div>

            {/* Admin Controls - Moved to ensure z-index priority over overlay */}
            {user?.role === 'admin' && (
              <button 
                type="button"
                onClick={(e) => handleDelete(project.id, e)}
                className="absolute top-2 right-2 z-[60] p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer shadow-lg"
                title="删除作品"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="p-6 relative z-20 bg-slate-800">
               <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack.map(t => (
                    <span key={t} className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{t}</span>
                  ))}
               </div>
               <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
               <p className="text-slate-400">{project.description}</p>
            </div>
          </div>
        ))}
      </div>

       {/* Infinite Scroll Loader */}
       <div ref={loadMoreRef} className="w-full py-12 flex justify-center items-center">
        {isLoadingMore ? (
          <div className="flex flex-col items-center gap-2 text-indigo-400">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm">正在加载更多作品...</span>
          </div>
        ) : !hasMore ? (
          <div className="text-slate-600 text-sm text-center">——— 已加载全部作品 ———</div>
        ) : (
          <div className="h-4"></div>
        )}
      </div>
    </div>
  );
};
