import request from './request';

/**
 * 标签数据接口
 */
export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  postCount: number;
}

/**
 * 获取所有标签（按创建时间降序）
 */
export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await request.get<Tag[]>('/tags');
    return response;
  } catch (error) {
    console.error('获取标签列表失败:', error);
    throw error;
  }
};
