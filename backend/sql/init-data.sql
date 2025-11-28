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
INSERT INTO `users` (`id`, `username`, `password`, `email`, `nickname`, `avatar`, `role`, `provider`, `status`) VALUES
(1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@riverblog.com', '站长本人', 'https://picsum.photos/id/64/100/100', 'admin', 'local', 1);

-- 普通用户（密码: user123）
INSERT INTO `users` (`id`, `username`, `password`, `email`, `nickname`, `avatar`, `role`, `provider`, `status`) VALUES
(2, 'testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'user@riverblog.com', '测试用户', 'https://picsum.photos/id/65/100/100', 'user', 'local', 1);

-- =============================================
-- 2. 初始化博客标签数据
-- =============================================
INSERT INTO `blog_tags` (`id`, `name`) VALUES
(1, 'Frontend'),
(2, 'Backend'),
(3, 'Performance'),
(4, 'React'),
(5, 'Vue'),
(6, 'JavaScript'),
(7, 'TypeScript'),
(8, 'Node.js'),
(9, 'Database'),
(10, 'DevOps'),
(11, 'Algorithm'),
(12, 'Design Pattern');

-- =============================================
-- 3. 初始化博客文章数据
-- =============================================
INSERT INTO `blog_posts` (`id`, `user_id`, `title`, `excerpt`, `content`, `cover`, `views`, `comments`, `status`) VALUES
(1, 1, '技术探索 No.1：Web前端性能优化实战指南', 
'深入探讨现代浏览器的渲染机制，以及如何利用最新的 Web API 提升应用性能。包含大量实战案例与代码演示。',
'<h2>前言</h2><p>在现代Web开发中，性能优化是一个永恒的话题。本文将从浏览器渲染原理出发，深入探讨前端性能优化的各个方面。</p><h2>浏览器渲染流程</h2><p>理解浏览器的渲染流程是进行性能优化的基础...</p><h2>性能优化策略</h2><p>1. 减少重排和重绘<br>2. 使用虚拟列表<br>3. 图片懒加载<br>4. 代码分割</p>',
'https://picsum.photos/seed/blog1/800/450', 1580, 23, 'published'),

(2, 1, '技术探索 No.2：React 18 新特性全面解析', 
'React 18 带来了许多令人兴奋的新特性，包括并发渲染、自动批处理、Transitions API 等。让我们一起探索这些新功能。',
'<h2>React 18 概述</h2><p>React 18 是一个重要的版本更新，引入了并发渲染等革命性特性。</p><h2>并发渲染</h2><p>并发渲染允许 React 同时准备多个版本的 UI...</p><h2>自动批处理</h2><p>React 18 会自动批处理所有更新，无论它们来自哪里...</p>',
'https://picsum.photos/seed/blog2/800/450', 2150, 34, 'published'),

(3, 1, '技术探索 No.3：TypeScript 高级类型系统详解', 
'TypeScript 的类型系统非常强大，掌握高级类型能让你的代码更加健壮和优雅。本文深入讲解条件类型、映射类型等高级特性。',
'<h2>为什么需要高级类型</h2><p>TypeScript 的基础类型能满足大部分需求，但在复杂场景下，我们需要更强大的类型工具。</p><h2>条件类型</h2><p>条件类型允许我们根据条件选择类型...</p><h2>映射类型</h2><p>映射类型可以基于旧类型创建新类型...</p>',
'https://picsum.photos/seed/blog3/800/450', 987, 15, 'published'),

(4, 1, '技术探索 No.4：Node.js 微服务架构实践', 
'微服务架构已成为现代后端开发的主流选择。本文分享如何使用 Node.js 构建可扩展的微服务系统。',
'<h2>微服务架构概述</h2><p>微服务架构将大型应用拆分为多个小型服务，每个服务独立部署和扩展。</p><h2>服务拆分原则</h2><p>1. 单一职责原则<br>2. 业务边界清晰<br>3. 独立部署能力</p><h2>技术选型</h2><p>我们选择 Nest.js 作为框架，使用 RabbitMQ 进行服务间通信...</p>',
'https://picsum.photos/seed/blog4/800/450', 1234, 28, 'published'),

(5, 1, '技术探索 No.5：数据库索引优化实战', 
'数据库索引是提升查询性能的关键。本文通过实际案例讲解如何正确使用索引，以及常见的索引优化技巧。',
'<h2>索引基础</h2><p>索引是一种数据结构，能够帮助数据库快速定位数据。</p><h2>索引类型</h2><p>1. B+树索引<br>2. 哈希索引<br>3. 全文索引</p><h2>索引优化策略</h2><p>避免索引失效、合理使用联合索引、定期分析索引性能...</p>',
'https://picsum.photos/seed/blog5/800/450', 1678, 41, 'published'),

(6, 1, '技术探索 No.6：设计模式在前端开发中的应用', 
'设计模式不仅适用于后端，在前端开发中同样有广泛应用。本文介绍常用的设计模式及其在 React 中的实践。',
'<h2>设计模式概述</h2><p>设计模式是软件开发中反复出现的问题的经典解决方案。</p><h2>常用模式</h2><p>1. 单例模式<br>2. 观察者模式<br>3. 工厂模式<br>4. 策略模式</p><h2>React 中的应用</h2><p>HOC、Render Props、自定义 Hooks 都是设计模式的体现...</p>',
'https://picsum.photos/seed/blog6/800/450', 1432, 19, 'published');

-- =============================================
-- 4. 初始化博客文章-标签关联数据
-- =============================================
INSERT INTO `blog_post_tags` (`post_id`, `tag_id`) VALUES
-- 文章1的标签
(1, 1), (1, 3), (1, 6),
-- 文章2的标签
(2, 1), (2, 4), (2, 7),
-- 文章3的标签
(3, 1), (3, 7), (3, 6),
-- 文章4的标签
(4, 2), (4, 8), (4, 10),
-- 文章5的标签
(5, 2), (5, 9), (5, 3),
-- 文章6的标签
(6, 1), (6, 4), (6, 12);

-- =============================================
-- 5. 初始化项目作品数据
-- =============================================
INSERT INTO `projects` (`id`, `user_id`, `title`, `description`, `image`, `link`, `sort_order`) VALUES
(1, 1, 'Creative Project 1', 
'基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。', 
'https://picsum.photos/seed/project1/800/600', 
'https://github.com/river/project1', 1),

(2, 1, 'Creative Project 2', 
'基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。', 
'https://picsum.photos/seed/project2/800/600', 
'https://github.com/river/project2', 2),

(3, 1, 'Creative Project 3', 
'基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。', 
'https://picsum.photos/seed/project3/800/600', 
'https://github.com/river/project3', 3),

(4, 1, 'Creative Project 4', 
'基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。', 
'https://picsum.photos/seed/project4/800/600', 
'https://github.com/river/project4', 4),

(5, 1, 'Creative Project 5', 
'基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。', 
'https://picsum.photos/seed/project5/800/600', 
'https://github.com/river/project5', 5),

(6, 1, 'Creative Project 6', 
'基于 React + Tailwind 的高性能应用，支持 WebGL 3D 渲染与实时交互。', 
'https://picsum.photos/seed/project6/800/600', 
'https://github.com/river/project6', 6);

-- =============================================
-- 6. 初始化项目技术栈数据
-- =============================================
INSERT INTO `project_tech_stack` (`project_id`, `tech_name`) VALUES
-- Project 1
(1, 'React'), (1, 'WebGL'), (1, 'Node.js'),
-- Project 2
(2, 'React'), (2, 'TypeScript'), (2, 'Tailwind CSS'),
-- Project 3
(3, 'Vue'), (3, 'Vite'), (3, 'Pinia'),
-- Project 4
(4, 'Next.js'), (4, 'Prisma'), (4, 'PostgreSQL'),
-- Project 5
(5, 'React'), (5, 'Three.js'), (5, 'WebGL'),
-- Project 6
(6, 'Nest.js'), (6, 'TypeORM'), (6, 'MySQL');

-- =============================================
-- 注意事项
-- =============================================
-- 1. 管理员默认密码为 admin123，建议首次登录后修改
-- 2. 测试用户密码为 user123
-- 3. 所有密码均使用 BCrypt 加密，加密强度为 10
-- 4. 图片 URL 使用 picsum.photos 作为占位符，实际使用时需要替换
