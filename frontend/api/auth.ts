import request from './request';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    role: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
  avatar: string;
  email?: string;
}

/**
 * 用户登录
 */
export const login = (data: LoginRequest) => {
  return request.post<LoginResponse>('/auth/login', data);
};

/**
 * 管理员快速登录
 */
export const adminLogin = () => {
  return request.post<LoginResponse>('/auth/admin');
};

/**
 * 登出
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * 保存登录信息
 */
export const saveLoginInfo = (response: LoginResponse) => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 用户注册
 */
export const register = (data: RegisterRequest) => {
  return request.post<LoginResponse>('/auth/register', data);
};

/**
 * 上传头像
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/files/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('头像上传失败');
  }
  
  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '头像上传失败');
  }
  
  return result.data;
};

/**
 * 获取管理员信息（公开接口）
 */
export const getAdminProfile = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/users/admin-profile`);
  
  if (!response.ok) {
    throw new Error('获取管理员信息失败');
  }
  
  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '获取管理员信息失败');
  }
  
  return result.data;
};

/**
 * 更新用户头像
 */
export const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/users/avatar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar: avatarUrl }),
  });
  
  if (!response.ok) {
    throw new Error('头像更新失败');
  }
  
  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '头像更新失败');
  }
  
  // 更新本地存储的用户信息
  const currentUser = getCurrentUser();
  if (currentUser) {
    currentUser.avatar = avatarUrl;
    localStorage.setItem('user', JSON.stringify(currentUser));
  }
};
