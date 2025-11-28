import request from './request';

export interface LoginRequest {
  username: string;
  password: string;
  provider?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    role: string;
    provider?: string;
  };
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
