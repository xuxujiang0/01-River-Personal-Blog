/**
 * 获取用户头像URL
 * 如果用户没有设置头像，根据角色返回默认头像
 */
export const getAvatarUrl = (user: { avatar?: string | null; role?: string } | null): string => {
  if (!user) {
    return '/user-avatar.svg';
  }
  
  // 如果用户有自定义头像，使用自定义头像
  if (user.avatar) {
    // 如果是完整URL，直接返回
    if (user.avatar.startsWith('http')) {
      return user.avatar;
    }
    // 如果是SVG文件，直接返回
    if (user.avatar.endsWith('.svg')) {
      return user.avatar;
    }
    // 如果是/files/开头的相对路径，需要添加API前缀
    if (user.avatar.startsWith('/files/')) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      return apiBase + user.avatar;
    }
    // 其他相对路径，直接返回
    return user.avatar;
  }
  
  // 根据角色返回默认头像
  if (user.role === 'admin') {
    return '/admin-avatar.svg';
  }
  
  return '/user-avatar.svg';
};
