const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface FileUploadResponse {
  url: string;
  filename: string;
}

/**
 * 上传文件
 */
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  try {
    console.log('[文件上传] 开始上传文件:', file.name, '大小:', (file.size / 1024).toFixed(2), 'KB');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未登录，请先登录');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('[文件上传] 发送请求到:', `${API_BASE_URL}/files/upload`);
    
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    console.log('[文件上传] 响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[文件上传] 请求失败:', errorText);
      throw new Error(`文件上传失败: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('[文件上传] 响应数据:', result);
    
    if (result.code !== 200) {
      throw new Error(result.message || '文件上传失败');
    }
    
    console.log('[文件上传] 上传成功, URL:', result.data.url);
    return result.data;
  } catch (error: any) {
    console.error('[文件上传] 上传失败:', error);
    throw error;
  }
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
