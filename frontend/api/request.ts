// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 获取Token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// 请求拦截器
const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '请求失败');
  }
  
  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '操作失败');
  }
  
  return result.data;
};

export default {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T>(url: string, data?: any) => request<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: <T>(url: string, data?: any) => request<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
