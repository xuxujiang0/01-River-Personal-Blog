-- =============================================
-- River Personal Blog - Database Schema (DDL)
-- Database: RIVER_BLOG
-- MySQL Version: 5.7
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS RIVER_BLOG DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE RIVER_BLOG;

-- =============================================
-- 1. 用户表 (users)
-- =============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `nickname` VARCHAR(50) NOT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `role` VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin/user/guest',
  `provider` VARCHAR(20) DEFAULT NULL COMMENT '登录方式：wechat/github/local',
  `provider_id` VARCHAR(100) DEFAULT NULL COMMENT '第三方登录ID',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_provider` (`provider`, `provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 2. 博客文章表 (blog_posts)
-- =============================================
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `user_id` BIGINT NOT NULL COMMENT '作者ID',
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
  `excerpt` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',
  `content` LONGTEXT NOT NULL COMMENT '文章内容（HTML/Markdown）',
  `cover` VARCHAR(500) DEFAULT NULL COMMENT '封面图URL',
  `views` INT NOT NULL DEFAULT 0 COMMENT '浏览量',
  `comments` INT NOT NULL DEFAULT 0 COMMENT '评论数',
  `status` VARCHAR(20) NOT NULL DEFAULT 'published' COMMENT '状态：published/hidden/draft',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客文章表';

-- =============================================
-- 3. 博客标签表 (blog_tags)
-- =============================================
DROP TABLE IF EXISTS `blog_tags`;
CREATE TABLE `blog_tags` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客标签表';

-- =============================================
-- 4. 博客文章-标签关联表 (blog_post_tags)
-- =============================================
DROP TABLE IF EXISTS `blog_post_tags`;
CREATE TABLE `blog_post_tags` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `post_id` BIGINT NOT NULL COMMENT '文章ID',
  `tag_id` BIGINT NOT NULL COMMENT '标签ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_tag` (`post_id`, `tag_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客文章-标签关联表';

-- =============================================
-- 5. 文章内容图片表 (blog_content_images)
-- =============================================
DROP TABLE IF EXISTS `blog_content_images`;
CREATE TABLE `blog_content_images` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `post_id` BIGINT NOT NULL COMMENT '文章ID',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章内容图片表';

-- =============================================
-- 6. 项目作品表 (projects)
-- =============================================
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `user_id` BIGINT NOT NULL COMMENT '创建者ID',
  `title` VARCHAR(200) NOT NULL COMMENT '项目标题',
  `description` TEXT DEFAULT NULL COMMENT '项目描述',
  `image` VARCHAR(500) DEFAULT NULL COMMENT '项目图片URL',
  `link` VARCHAR(500) DEFAULT NULL COMMENT '项目链接',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目作品表';

-- =============================================
-- 7. 项目技术栈表 (project_tech_stack)
-- =============================================
DROP TABLE IF EXISTS `project_tech_stack`;
CREATE TABLE `project_tech_stack` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '技术栈ID',
  `project_id` BIGINT NOT NULL COMMENT '项目ID',
  `tech_name` VARCHAR(50) NOT NULL COMMENT '技术名称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目技术栈表';

-- =============================================
-- 8. 上传文件表 (uploaded_files)
-- =============================================
DROP TABLE IF EXISTS `uploaded_files`;
CREATE TABLE `uploaded_files` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `user_id` BIGINT NOT NULL COMMENT '上传者ID',
  `original_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
  `saved_name` VARCHAR(255) NOT NULL COMMENT '保存的文件名',
  `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径',
  `file_url` VARCHAR(500) NOT NULL COMMENT '文件访问URL',
  `file_size` BIGINT NOT NULL COMMENT '文件大小（字节）',
  `file_type` VARCHAR(100) DEFAULT NULL COMMENT '文件类型',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='上传文件表';
