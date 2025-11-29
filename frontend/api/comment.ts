import request from './request';

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  nickname: string;
  avatar: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: number;
}

/**
 * 获取博客评论列表
 */
export const getComments = (postId: string) => {
  return request.get<Comment[]>(`/blogs/${postId}/comments`);
};

/**
 * 发表评论
 */
export const createComment = (postId: string, data: CreateCommentRequest) => {
  return request.post<Comment>(`/blogs/${postId}/comments`, data);
};

/**
 * 删除评论
 */
export const deleteComment = (postId: string, commentId: number) => {
  return request.delete(`/blogs/${postId}/comments/${commentId}`);
};
