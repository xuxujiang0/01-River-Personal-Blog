
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, BlogPost, Project } from './types';

// Initial Mock Data for Blogs
const INITIAL_BLOGS: BlogPost[] = Array.from({ length: 6 }).map((_, index) => {
  const id = index + 1;
  return {
    id: id.toString(),
    title: `技术探索 No.${id}：Web前端性能优化实战指南`,
    excerpt: '深入探讨现代浏览器的渲染机制，以及如何利用最新的 Web API 提升应用性能。包含大量实战案例与代码演示。',
    content: `<p>这里是文章内容详情...</p>`,
    date: '2023-10-24',
    views: Math.floor(Math.random() * 2000) + 100,
    comments: Math.floor(Math.random() * 50),
    tags: ['Frontend', 'Performance', 'React'],
    cover: `https://picsum.photos/seed/blog${id}/800/450`,
    status: 'published'
  };
});

// Initial Mock Data for Projects
const INITIAL_PROJECTS: Project[] = Array.from({ length: 6 }).map((_, i) => {
  const id = i + 1;
  return {
    id: id.toString(),
    title: `Creative Project ${id}`,
    description: '基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。',
    image: `https://picsum.photos/seed/project${id}/800/600`,
    techStack: ['React', 'WebGL', 'Node.js'],
    link: '#'
  };
});

interface AppContextType {
  user: User | null;
  login: (provider: 'wechat' | 'github' | 'admin') => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  // Blog related
  blogs: BlogPost[];
  addBlog: (post: BlogPost) => void;
  deleteBlog: (id: string) => void;
  toggleBlogStatus: (id: string) => void;
  // Project related
  projects: Project[];
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const login = (provider: 'wechat' | 'github' | 'admin') => {
    if (provider === 'admin') {
      setUser({
        id: 'admin-1',
        name: '站长本人',
        avatar: 'https://picsum.photos/id/64/100/100',
        role: 'admin',
      });
    } else {
      setUser({
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: provider === 'wechat' ? '微信用户' : 'GitHub User',
        avatar: `https://picsum.photos/seed/${Math.random()}/100/100`,
        role: 'user',
        provider,
      });
    }
  };

  const logout = () => setUser(null);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const addBlog = (post: BlogPost) => {
    setBlogs(prev => [post, ...prev]);
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const toggleBlogStatus = (id: string) => {
    setBlogs(prev => prev.map(b => 
      b.id === id ? { ...b, status: b.status === 'published' ? 'hidden' : 'published' } : b
    ));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, isAuthModalOpen, openAuthModal, closeAuthModal, 
      blogs, addBlog, deleteBlog, toggleBlogStatus,
      projects, addProject, deleteProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
