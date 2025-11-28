
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, BlogPost, Project } from './types';
import * as authApi from './api/auth';
import * as blogApi from './api/blog';
import * as projectApi from './api/project';

// 初始空数据，将从后端加载
const INITIAL_BLOGS: BlogPost[] = [];
const INITIAL_PROJECTS: Project[] = [];

interface AppContextType {
  user: User | null;
  login: (provider: 'wechat' | 'github' | 'admin', credentials?: { username: string; password: string }) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(() => {
    // 从 localStorage 恢复用户信息
    return authApi.getCurrentUser();
  });
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  // 初始化时加载数据
  useEffect(() => {
    loadBlogs();
    loadProjects();
  }, []);

  // 加载博客列表
  const loadBlogs = async () => {
    try {
      const response = await blogApi.getBlogList({ page: 1, size: 100 });
      // 映射后端数据，处理日期字段
      const mappedBlogs = response.list.map(blog => ({
        ...blog,
        date: blog.createdAt ? blog.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        id: String(blog.id),
      }));
      setBlogs(mappedBlogs);
    } catch (error) {
      console.error('加载博客列表失败:', error);
    }
  };

  // 加载项目列表
  const loadProjects = async () => {
    try {
      const projectList = await projectApi.getProjectList();
      // 映射ID为字符串
      const mappedProjects = projectList.map(project => ({
        ...project,
        id: String(project.id),
      }));
      setProjects(mappedProjects);
    } catch (error) {
      console.error('加载项目列表失败:', error);
    }
  };

  const login = async (provider: 'wechat' | 'github' | 'admin', credentials?: { username: string; password: string }) => {
    try {
      let response;
      if (provider === 'admin') {
        // 管理员登录
        if (!credentials) {
          throw new Error('管理员登录需要提供账号密码');
        }
        response = await authApi.login({
          username: credentials.username,
          password: credentials.password,
        });
      } else if (provider === 'wechat') {
        // 微信登录 - 模拟微信授权流程
        console.log('正在跳转到微信授权页面...');
        // TODO: 实际应该打开微信授权窗口，这里使用模拟数据
        alert('微信登录功能开发中...\n\n提示：实际项目中需要：\n1. 跳转到微信授权页面\n2. 用户扫码授权\n3. 获取授权码\n4. 后端换取用户信息\n\n目前使用模拟登录');
        setUser({
          id: `wx-${Math.random().toString(36).substr(2, 9)}`,
          name: '微信用户',
          avatar: `https://picsum.photos/seed/wx${Math.random()}/100/100`,
          role: 'user',
          provider: 'wechat',
        });
        return;
      } else if (provider === 'github') {
        // GitHub登录 - 模拟OAuth流程
        console.log('正在跳转到GitHub授权页面...');
        alert('GitHub登录功能开发中...\n\n提示：实际项目中需要：\n1. 跳转到GitHub OAuth授权页面\n2. 用户授权\n3. 获取授权码\n4. 后端换取用户信息\n\n目前使用模拟登录');
        setUser({
          id: `gh-${Math.random().toString(36).substr(2, 9)}`,
          name: 'GitHub User',
          avatar: `https://picsum.photos/seed/gh${Math.random()}/100/100`,
          role: 'user',
          provider: 'github',
        });
        return;
      }
      
      // 保存登录信息
      authApi.saveLoginInfo(response);
      // 映射后端用户数据到前端格式
      setUser({
        id: response.user.id,
        name: response.user.nickname || response.user.username,
        username: response.user.username,
        nickname: response.user.nickname,
        avatar: response.user.avatar,
        role: response.user.role as 'admin' | 'user' | 'guest',
        provider: response.user.provider as 'wechat' | 'github' | undefined,
      });
    } catch (error: any) {
      console.error('登录失败:', error);
      const errorMessage = error?.message || '登录失败，请重试';
      alert(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const addBlog = async (post: BlogPost) => {
    try {
      const newBlog = await blogApi.createBlog({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        cover: post.cover,
        tags: post.tags,
        status: post.status as 'published' | 'hidden' | 'draft',
        contentImages: post.contentImages,
      });
      setBlogs(prev => [newBlog, ...prev]);
    } catch (error) {
      console.error('创建博客失败:', error);
      throw error;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await blogApi.deleteBlog(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('删除博客失败:', error);
      throw error;
    }
  };

  const toggleBlogStatus = async (id: string) => {
    try {
      await blogApi.toggleBlogStatus(id);
      setBlogs(prev => prev.map(b => 
        b.id === id ? { ...b, status: b.status === 'published' ? 'hidden' : 'published' } : b
      ));
    } catch (error) {
      console.error('切换博客状态失败:', error);
      throw error;
    }
  };

  const addProject = async (project: Project) => {
    try {
      const newProject = await projectApi.createProject({
        title: project.title,
        description: project.description,
        image: project.image,
        link: project.link,
        techStack: project.techStack,
      });
      setProjects(prev => [newProject, ...prev]);
    } catch (error) {
      console.error('创建项目失败:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectApi.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('删除项目失败:', error);
      throw error;
    }
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
