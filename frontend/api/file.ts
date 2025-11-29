const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface FileUploadResponse {
  url: string;
  filename: string;
}

/**
 * 上传文件
 */
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const token = localStorage.getItem('token');
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('文件上传失败');
  }
  
  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '文件上传失败');
  }
  
  return result.data;
};

/**
 * 获取文件完整URL
 */
export const getFileUrl = (path: string | undefined | null): string => {
  if (!path) {
    return ''; // 返回空字符串，避免显示错误
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};
