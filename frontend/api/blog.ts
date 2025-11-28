import request from './request';
import { BlogPost } from '../types';

export interface BlogListResponse {
  list: BlogPost[];
  total: number;
  page: number;
  size: number;
}

export interface BlogPostRequest {
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string[];
  status: 'published' | 'hidden' | 'draft';
  contentImages?: string[];
}

/**
 * 获取博客列表
 */
export const getBlogList = (params?: {
  page?: number;
  size?: number;
  status?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.size) query.append('size', params.size.toString());
  if (params?.status) query.append('status', params.status);
  
  const queryString = query.toString();
  return request.get<BlogListResponse>(`/blogs${queryString ? `?${queryString}` : ''}`);
};

/**
 * 获取博客详情
 */
export const getBlogDetail = (id: string) => {
  return request.get<BlogPost>(`/blogs/${id}`);
};

/**
 * 创建博客
 */
export const createBlog = (data: BlogPostRequest) => {
  return request.post<BlogPost>('/blogs', data);
};

/**
 * 更新博客
 */
export const updateBlog = (id: string, data: BlogPostRequest) => {
  return request.put<BlogPost>(`/blogs/${id}`, data);
};

/**
 * 删除博客
 */
export const deleteBlog = (id: string) => {
  return request.delete(`/blogs/${id}`);
};

/**
 * 切换博客状态
 */
export const toggleBlogStatus = (id: string) => {
  return request.put(`/blogs/${id}/status`);
};
