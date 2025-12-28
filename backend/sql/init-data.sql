-- =============================================
-- River Personal Blog - Initial Data (DML)
-- Database: RIVER_BLOG
-- MySQL Version: 5.7
-- =============================================

USE RIVER_BLOG;

-- =============================================
-- 1. 初始化用户数据
-- =============================================
-- 管理员账户（密码: admin123，使用BCrypt加密）
-- BCrypt Hash 生成方式: new BCryptPasswordEncoder().encode("admin123")
INSERT INTO `users` (`id`, `username`, `password`, `email`, `nickname`, `avatar`, `role`, `status`) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@riverblog.com', '站长本人', '/admin-avatar.svg', 'admin', 1);

-- =============================================
-- 注意事项
-- =============================================
-- 1. 管理员默认密码为 admin123，建议首次登录后修改
-- 2. 测试用户密码为 user123
-- 3. 所有密码均使用 BCrypt 加密，加密强度为 10
-- 4. 图片 URL 使用 picsum.photos 作为占位符，实际使用时需要替换
