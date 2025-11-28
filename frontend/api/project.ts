import request from './request';
import { Project } from '../types';

export interface ProjectRequest {
  title: string;
  description: string;
  image: string;
  link: string;
  techStack: string[];
}

/**
 * 获取项目列表
 */
export const getProjectList = () => {
  return request.get<Project[]>('/projects');
};

/**
 * 获取项目详情
 */
export const getProjectDetail = (id: string) => {
  return request.get<Project>(`/projects/${id}`);
};

/**
 * 创建项目
 */
export const createProject = (data: ProjectRequest) => {
  return request.post<Project>('/projects', data);
};

/**
 * 更新项目
 */
export const updateProject = (id: string, data: ProjectRequest) => {
  return request.put<Project>(`/projects/${id}`, data);
};

/**
 * 删除项目
 */
export const deleteProject = (id: string) => {
  return request.delete(`/projects/${id}`);
};
