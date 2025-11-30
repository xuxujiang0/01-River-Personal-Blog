
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
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  // Blog related
  blogs: BlogPost[];
  addBlog: (post: BlogPost) => void;
  deleteBlog: (id: string) => void;
  toggleBlogStatus: (id: string) => void;
  loadBlogs: () => Promise<void>;
  // Project related
  projects: Project[];
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // 从 localStorage 恢复用户信息
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      // 确保用户对象包含所有必需的字段
      return {
        id: currentUser.id,
        name: currentUser.nickname || currentUser.username || currentUser.name,
        username: currentUser.username,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
        role: currentUser.role,
      };
    }
    return null;
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

  const login = async (credentials: { username: string; password: string }) => {
    try {
      // 管理员登录
      if (!credentials) {
        throw new Error('登录需要提供账号密码');
      }
      const response = await authApi.login({
        username: credentials.username,
        password: credentials.password,
      });
      
      console.log('[登录成功] 后端返回的用户信息:', response.user);
      console.log('[登录成功] 用户头像路径:', response.user.avatar);
      
      // 保存登录信息
      authApi.saveLoginInfo(response);
      // 映射后端用户数据到前端格式
      const userInfo = {
        id: response.user.id,
        name: response.user.nickname || response.user.username,
        username: response.user.username,
        nickname: response.user.nickname,
        avatar: response.user.avatar,
        role: response.user.role as 'admin' | 'user' | 'guest',
      };
      
      console.log('[登录成功] 设置到状态的用户信息:', userInfo);
      setUser(userInfo);
    } catch (error: any) {
      console.error('[登录失败]:', error);
      const errorMessage = error?.message || '登录失败，请重试';
      window.toast?.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };
  
  const updateAvatar = (avatarUrl: string) => {
    if (user) {
      setUser({ ...user, avatar: avatarUrl });
    }
  };
  
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const addBlog = (post: BlogPost) => {
    // 直接添加到状态，不再调用API（因为调用方已经创建了博客）
    setBlogs(prev => [post, ...prev]);
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
      user, login, logout, updateAvatar, isAuthModalOpen, openAuthModal, closeAuthModal, 
      blogs, addBlog, deleteBlog, toggleBlogStatus, loadBlogs,
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
