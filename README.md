# 🌟 River Personal Blog

<div align="center">

一个现代化的全栈个人博客系统，采用暗黑霓虹主题设计，提供博客写作、作品展示、用户认证等完整功能。

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6db33f?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479a1?logo=mysql)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 项目简介

这是一个基于 **React + TypeScript + Spring Boot + MySQL** 构建的现代化全栈个人博客系统。

**前端**采用 React 19 + TypeScript + Vite，提供流畅的 SPA 体验和优雅的暗黑霓虹主题设计。

**后端**基于 Spring Boot 3.2 + MyBatis + MySQL，提供 RESTful API、JWT 认证、文件上传等完整后端服务。

### ✨ 核心特性

#### 前端特性
- 🎨 **暗黑霓虹主题** - 独特的视觉设计，荧光绿高亮配色
- 📝 **富文本编辑** - Markdown 支持，代码高亮，图片上传
- 🎯 **作品展示** - 网格布局展示个人项目和技术栈
- 🔐 **用户认证** - 完整的登录/注册流程，JWT Token 管理
- 🎮 **交互式组件** - 游戏模块、动画效果等趣味互动元素
- 📱 **响应式设计** - 完美适配移动端和桌面端
- ⚡ **快速开发体验** - Vite HMR 提供毫秒级热更新

#### 后端特性
- 🔒 **Spring Security** - JWT Token 认证，BCrypt 密码加密
- 💾 **数据持久化** - MyBatis + MySQL，完整的 CRUD 操作
- 📁 **文件管理** - 支持图片上传，自动目录管理
- 🏷️ **标签系统** - 动态标签管理，博客分类
- 💬 **评论系统** - 支持博客评论，嵌套回复
- 🔄 **CORS 配置** - 完善的跨域支持
- 📊 **统一响应** - Result 统一返回格式

---

## 🛠️ 技术栈

### 前端技术栈

#### 核心框架
- **React 19.2.0** - 最新的前端 UI 框架
- **TypeScript 5.8.2** - 类型安全的 JavaScript 超集
- **Vite 6.2.0** - 下一代前端构建工具，极速 HMR

#### 路由与状态
- **React Router DOM 7.9.6** - 单页应用路由管理
- **React Context API** - 轻量级全局状态管理

#### UI 与样式
- **Tailwind CSS** - 原子化 CSS 框架，快速构建 UI
- **Lucide React** - 精美的图标库（555+ 图标）

#### 开发工具
- **@vitejs/plugin-react** - React 快速刷新支持
- **@types/node** - Node.js 类型定义

### 后端技术栈

#### 核心框架
- **Spring Boot 3.2.0** - 企业级 Java 应用框架
- **Java 21** - 最新 LTS 版本 Java
- **Maven** - 项目构建和依赖管理

#### 数据层
- **MyBatis 3.0.3** - 持久层框架，SQL 映射
- **MySQL 5.7+** - 关系型数据库
- **HikariCP** - 高性能数据库连接池

#### 安全认证
- **Spring Security** - 安全框架，权限控制
- **JWT (JJWT 0.12.3)** - Token 认证
- **BCrypt** - 密码加密算法

#### 其他依赖
- **Lombok** - 简化 Java 代码
- **Spring Boot DevTools** - 开发热部署
- **Spring Validation** - 参数校验

---

## 📁 项目结构

```
01 River Personal Blog/
├── frontend/                      # 前端项目
│   ├── api/                      # API 接口封装
│   │   ├── request.ts           # Axios 请求封装
│   │   ├── auth.ts              # 认证相关 API
│   │   ├── blog.ts              # 博客相关 API
│   │   ├── project.ts           # 项目相关 API
│   │   ├── file.ts              # 文件上传 API
│   │   ├── tag.ts               # 标签相关 API
│   │   └── comment.ts           # 评论相关 API
│   ├── components/               # 组件目录
│   │   ├── AuthModal.tsx        # 登录认证模态框
│   │   ├── AvatarModal.tsx      # 头像修改模态框
│   │   ├── BackToTop.tsx        # 返回顶部按钮
│   │   ├── GameModules.tsx      # 游戏模块组件
│   │   ├── Navbar.tsx           # 导航栏组件
│   │   ├── TankFooter.tsx       # 页脚组件
│   │   ├── TankTrack.tsx        # 坦克履带特效
│   │   └── Toast.tsx            # 消息提示组件
│   ├── hooks/                    # 自定义 Hooks
│   │   └── useToast.tsx         # Toast Hook
│   ├── pages/                    # 页面目录
│   │   ├── Home.tsx             # 首页
│   │   ├── Blog.tsx             # 博客列表页
│   │   ├── WriteBlog.tsx        # 写博客页面
│   │   ├── Works.tsx            # 作品展示页
│   │   ├── WriteProject.tsx     # 添加作品页面
│   │   ├── About.tsx            # 关于页面
│   │   └── Register.tsx         # 用户注册页面
│   ├── public/                   # 静态资源
│   │   └── index.css            # 全局样式
│   ├── utils/                    # 工具函数
│   │   └── avatar.ts            # 头像处理工具
│   ├── App.tsx                   # 应用主入口
│   ├── index.tsx                # React 渲染入口
│   ├── store.tsx                # 全局状态管理
│   ├── types.ts                 # TypeScript 类型定义
│   ├── global.d.ts              # 全局类型声明
│   ├── vite.config.ts           # Vite 配置文件
│   ├── tsconfig.json            # TypeScript 配置
│   ├── package.json             # 项目依赖配置
│   ├── Dockerfile               # 前端 Docker 镜像配置
│   ├── nginx.conf               # Nginx 配置文件
│   └── .dockerignore            # Docker 构建忽略文件
│
└── backend/                      # 后端项目
    ├── sql/                     # 数据库脚本
    │   ├── schema.sql           # 数据库表结构
    │   └── init-data.sql        # 初始化数据
    ├── src/main/
    │   ├── java/com/river/blog/
    │   │   ├── common/          # 公共类
    │   │   │   └── Result.java # 统一返回结果
    │   │   ├── config/          # 配置类
    │   │   │   ├── CorsConfig.java          # 跨域配置
    │   │   │   ├── SecurityConfig.java      # 安全配置
    │   │   │   └── PasswordHashGenerator.java # 密码生成器
    │   │   ├── controller/      # 控制器层
    │   │   │   ├── AuthController.java      # 认证控制器
    │   │   │   ├── BlogPostController.java  # 博客控制器
    │   │   │   ├── BlogCommentController.java # 评论控制器
    │   │   │   ├── ProjectController.java    # 项目控制器
    │   │   │   ├── FileController.java       # 文件控制器
    │   │   │   ├── TagController.java        # 标签控制器
    │   │   │   ├── UserController.java       # 用户控制器
    │   │   │   └── UtilController.java       # 工具控制器（含健康检查）
    │   │   ├── dto/             # 数据传输对象
    │   │   │   ├── LoginRequest.java  # 登录请求
    │   │   │   └── LoginResponse.java # 登录响应
    │   │   ├── entity/          # 实体类
    │   │   │   ├── User.java          # 用户实体
    │   │   │   ├── BlogPost.java      # 博客实体
    │   │   │   ├── BlogComment.java   # 评论实体
    │   │   │   └── Project.java       # 项目实体
    │   │   ├── filter/          # 过滤器
    │   │   │   └── JwtAuthenticationFilter.java # JWT 认证过滤器
    │   │   ├── mapper/          # MyBatis Mapper 接口
    │   │   │   ├── UserMapper.java
    │   │   │   ├── BlogPostMapper.java
    │   │   │   ├── BlogTagMapper.java
    │   │   │   ├── BlogCommentMapper.java
    │   │   │   └── ProjectMapper.java
    │   │   ├── service/         # 服务层接口
    │   │   │   ├── UserService.java
    │   │   │   ├── BlogPostService.java
    │   │   │   ├── ProjectService.java
    │   │   │   └── FileService.java
    │   │   ├── service/impl/    # 服务层实现
    │   │   │   ├── UserServiceImpl.java
    │   │   │   ├── BlogPostServiceImpl.java
    │   │   │   ├── ProjectServiceImpl.java
    │   │   │   └── FileServiceImpl.java
    │   │   ├── util/            # 工具类
    │   │   │   ├── JwtUtil.java        # JWT 工具类
    │   │   │   └── PasswordUtil.java   # 密码工具类
    │   │   └── RiverBlogApplication.java # Spring Boot 启动类
    │   └── resources/
    │       ├── mapper/          # MyBatis XML 映射文件
    │       │   ├── UserMapper.xml
    │       │   ├── BlogPostMapper.xml
    │       │   ├── BlogTagMapper.xml
    │       │   ├── BlogCommentMapper.xml
    │       │   └── ProjectMapper.xml
    │       ├── application.yml       # 开发环境配置
    │       └── application-prod.yml  # 生产环境配置
    ├── uploads/                 # 文件上传目录（运行时生成）
    ├── pom.xml                  # Maven 配置文件
    ├── Dockerfile               # 后端 Docker 镜像配置
    └── .dockerignore            # Docker 构建忽略文件
│
├── docker-compose.yml           # Docker Compose 编排配置
├── .env.example                 # 环境变量模板
├── deploy.sh                    # Linux/Mac 部署脚本
├── deploy.ps1                   # Windows PowerShell 部署脚本
├── DEPLOYMENT.md                # 详细部署文档
├── QUICK_DEPLOY.md              # 快速部署指南
├── ARCHITECTURE.md              # 部署架构说明
├── .gitignore                   # Git 忽略文件
└── README.md                    # 项目说明文档
```

---

## 🚀 快速开始

### 环境要求

#### 前端
- **Node.js**: >= 16.0.0
- **npm** / **yarn** / **pnpm**

#### 后端
- **Java**: 21
- **Maven**: 3.6+
- **MySQL**: 5.7+

#### 生产部署
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **服务器**: Linux (推荐 Ubuntu 20.04+)

### 开发环境安装步骤

#### 1. 克隆项目

```bash
git clone <your-repo-url>
cd "01 River Personal Blog"
```

#### 2. 后端配置与启动

**2.1 创建数据库**

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE RIVER_BLOG DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入表结构
USE RIVER_BLOG;
source backend/sql/schema.sql;

# 导入初始数据
source backend/sql/init-data.sql;
```

**2.2 配置数据库连接**

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/RIVER_BLOG?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your_password  # 修改为你的 MySQL 密码
```

**2.3 启动后端服务**

```bash
cd backend

# 方式 1：使用 Maven
mvn spring-boot:run

# 方式 2：打包后运行
mvn clean package
java -jar target/river-blog-1.0.0.jar

# 方式 3：在 IDE（IDEA/Eclipse）中运行 RiverBlogApplication.java
```

后端服务将在 `http://localhost:8080/api` 启动

**2.4 验证后端服务**

```bash
# 测试健康检查
curl http://localhost:8080/api/auth/admin

# 应该返回包含 token 的 JSON
```

#### 3. 前端配置与启动

**3.1 安装依赖**

```bash
cd frontend
npm install
```

**3.2 配置环境变量**

创建 `frontend/.env.local` 文件：

```env
# API 基础 URL
VITE_API_BASE_URL=http://localhost:8080/api
```

**3.3 启动前端服务**

```bash
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

**3.4 访问应用**

打开浏览器访问：`http://localhost:3000`

默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

#### 4. 构建生产版本

**前端构建**
```bash
cd frontend
npm run build       # 构建
npm run preview     # 预览构建结果
```

**后端构建**
```bash
cd backend
mvn clean package   # 打包为 jar
```

---

## 🐳 Docker 部署（推荐）

### 快速部署

项目已包含完整的 Docker 部署配置，可以一键部署到服务器。

#### 1. 上传项目到服务器

```bash
# 在本地压缩项目
tar -czf river-blog.tar.gz .

# 上传到服务器
scp river-blog.tar.gz user@your-server-ip:/home/user/

# SSH 登录服务器
ssh user@your-server-ip

# 解压
cd /home/user/
tar -xzf river-blog.tar.gz
cd river-blog
```

#### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置（修改数据库密码和 JWT 密钥）
vim .env
```

必须修改的配置：
```bash
# 数据库密码（务必修改）
DB_PASSWORD=your_secure_password

# JWT 密钥（务必修改为强密码）
JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters_long
```

#### 3. 执行部署

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows PowerShell:**
```powershell
.\deploy.ps1
```

**手动部署：**
```bash
# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 4. 访问应用

部署完成后，通过以下地址访问：

- **前端页面**: http://your-server-ip
- **后端 API**: http://your-server-ip/api

### 部署文件说明

项目包含以下部署文件：

- **docker-compose.yml** - Docker Compose 编排配置
- **backend/Dockerfile** - 后端 Docker 镜像构建文件
- **frontend/Dockerfile** - 前端 Docker 镜像构建文件
- **frontend/nginx.conf** - Nginx 配置文件
- **backend/application-prod.yml** - 生产环境配置
- **.env.example** - 环境变量模板
- **deploy.sh** - Linux/Mac 部署脚本
- **deploy.ps1** - Windows PowerShell 部署脚本
- **DEPLOYMENT.md** - 详细部署文档
- **QUICK_DEPLOY.md** - 快速部署指南
- **ARCHITECTURE.md** - 部署架构说明

### 服务管理

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f           # 所有服务
docker-compose logs -f backend   # 后端
docker-compose logs -f frontend  # 前端
docker-compose logs -f mysql     # 数据库

# 重启服务
docker-compose restart

# 停止服务
docker-compose stop

# 启动服务
docker-compose start

# 停止并删除容器
docker-compose down

# 更新应用
docker-compose up -d --build
```

### 数据备份

```bash
# 备份数据库
docker exec river-blog-mysql mysqldump -u root -p RIVER_BLOG > backup_$(date +%Y%m%d).sql

# 备份上传文件
docker cp river-blog-backend:/app/uploads ./uploads_backup_$(date +%Y%m%d)

# 恢复数据库
docker exec -i river-blog-mysql mysql -u root -p RIVER_BLOG < backup.sql

# 恢复上传文件
docker cp ./uploads_backup river-blog-backend:/app/uploads
```

### 更多详细信息

请查看：
- **快速部署**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **完整文档**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **架构说明**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📚 功能模块

### 1. 用户认证系统

#### 登录功能
- 🔐 **管理员登录** - 用户名密码登录，JWT Token 认证
- 🔑 **快速登录** - 一键管理员登录（开发调试）
- 💾 **登录状态保持** - Token 存储在 localStorage
- ⏰ **自动过期** - Token 7天有效期

#### 注册功能
- 📝 **用户注册** - 账号、密码、昵称、头像
- ✅ **表单验证** - 实时验证用户输入
- 💪 **密码强度** - 弱/中/强三级提示
- 🖼️ **头像上传** - 支持 JPG/PNG，最大 10MB
- 🔒 **密码加密** - BCrypt 加密存储

#### 用户管理
- 👤 **个人信息** - 查看和修改个人资料
- 🎨 **头像修改** - 随时更换头像
- 🚪 **退出登录** - 清除登录状态

### 2. 博客系统

#### 博客列表
- 📄 **文章展示** - 卡片式布局，封面图、标题、摘要
- 🏷️ **标签筛选** - 按标签分类浏览
- 👁️ **阅读统计** - 浏览量和评论数
- 📅 **发布时间** - 按时间排序
- 🔍 **状态筛选** - 已发布/已隐藏

#### 博客详情
- 📖 **文章阅读** - Markdown 渲染，代码高亮
- 🖼️ **内容图片** - 支持多图展示
- 💬 **评论系统** - 发表评论，嵌套回复
- 📊 **浏览统计** - 自动增加浏览量

#### 写博客 (管理员)
- ✍️ **富文本编辑** - Markdown 语法支持
- 🎨 **封面上传** - 自定义博客封面
- 🖼️ **内容配图** - 上传多张内容图片
- 📌 **代码块** - 支持多种编程语言
- 🏷️ **标签管理** - 选择已有标签或创建新标签
- 💾 **草稿保存** - 自动保存到 localStorage
- 🗑️ **草稿删除** - 清空当前草稿
- 📝 **字数统计** - 实时显示字数

#### 博客管理 (管理员)
- ✏️ **编辑文章** - 修改已发布的博客
- 🗑️ **删除文章** - 永久删除博客
- 🔒 **状态切换** - 发布/隐藏状态

### 3. 作品展示系统

#### 作品列表
- 🎨 **项目展示** - 网格布局展示作品
- 🖼️ **项目封面** - 精美的项目预览图
- 📝 **项目描述** - 详细的项目介绍
- 🔧 **技术栈** - 展示使用的技术
- 🔗 **外部链接** - 跳转到项目地址

#### 添加作品 (管理员)
- ➕ **创建项目** - 添加新作品
- 🖼️ **封面上传** - 项目封面图
- 📋 **技术栈** - 多选技术标签
- 🔗 **项目链接** - 可选外部链接

#### 作品管理 (管理员)
- 🗑️ **删除项目** - 移除作品

### 4. 文件管理系统

- 📁 **文件上传** - 支持图片上传
- 🗂️ **自动管理** - 生成唯一文件名（UUID）
- 📂 **目录管理** - 自动创建上传目录
- 🔒 **公开访问** - `/files/**` 公开接口
- 📏 **大小限制** - 最大 10MB
- 🎨 **格式支持** - JPG/PNG

### 5. 标签系统

- 🏷️ **标签管理** - 动态创建和查询标签
- 📊 **文章统计** - 显示每个标签的文章数
- 🔄 **自动关联** - 博客发布时自动创建标签
- 📅 **时间排序** - 按创建时间降序

### 6. 评论系统

- 💬 **发表评论** - 登录用户可评论
- 🔁 **嵌套回复** - 支持评论回复
- 👤 **用户信息** - 显示评论者昵称和头像
- 📅 **时间显示** - 评论发布时间
- 🗑️ **删除评论** - 管理员可删除

### 7. 首页 (Home)

- 🌟 **欢迎页面** - 个人介绍和简历
- 🎮 **交互式组件** - 游戏模块等趣味元素
- 🔗 **快速导航** - 跳转到博客和作品

### 8. 关于页面 (About)

- 👨‍💻 **个人信息** - 展示管理员资料
- 🎨 **动态头像** - 显示数据库中的真实头像
- 📧 **联系方式** - 社交媒体链接等

---

## 🎨 设计特色

### 视觉风格

#### 配色方案
- **主背景**: 纯黑 `#000000` / 深黑 `#0a0a0a`
- **次要背景**: 深灰 `#0d0d0d`
- **边框**: 暗灰 `#1f1f1f` / `#2a2a2a`
- **高亮色**: 霓虹绿 `#39ff14`
- **强调色**: Indigo `#4f46e5` / Purple `#7c3aed`
- **文本**: 白色 `#ffffff` / 灰色 `#a0a0a0`

#### 渐变效果
- **Indigo → Cyan**: `from-indigo-600 to-cyan-600`
- **Purple → Pink**: `from-purple-600 to-pink-600`
- **模糊装饰**: 彩色半透明圆形背景
- **阴影**: `shadow-[0_0_50px_rgba(0,0,0,0.8)]`

### 动画效果

#### CSS 动画
- **fadeIn** - 淡入动画（0.5s）
- **fadeUp** - 上浮淡入动画（0.8s）
- **slideIn** - 滑入动画
- **spin** - 旋转动画（加载状态）

#### 交互动画
- **hover:scale** - 悬停缩放（1.05）
- **hover:-translate-y** - 悬停上浮（-2px）
- **transition-all** - 全属性过渡
- **backdrop-blur** - 背景模糊效果

### 响应式设计

- **移动端优先**: Mobile-first 设计策略
- **断点**: `sm` (640px) / `md` (768px) / `lg` (1024px) / `xl` (1280px)
- **弹性布局**: Flexbox / Grid 布局
- **自适应字体**: 使用 `text-sm` / `text-base` / `text-lg`

---

## 🔧 配置说明

### 前端配置

#### Vite 配置 (`frontend/vite.config.ts`)

```typescript
{
  server: {
    port: 3000,           // 开发服务器端口
    host: '0.0.0.0',      // 允许外部访问
    proxy: {              // 可选：开发代理
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),  // @ 别名
    }
  }
}
```

#### TypeScript 配置 (`frontend/tsconfig.json`)

- **目标**: ES2022
- **模块**: ESNext
- **JSX**: react-jsx
- **严格模式**: 启用
- **路径别名**: `@/*`

#### 环境变量 (`frontend/.env.local`)

```env
# API 基础 URL
VITE_API_BASE_URL=http://localhost:8080/api
```

### 后端配置

#### Spring Boot 配置 (`backend/src/main/resources/application.yml`)

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/RIVER_BLOG?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: root
  
  # 文件上传配置
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB
      max-request-size: 10MB

# MyBatis 配置
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.river.blog.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

# JWT 配置
jwt:
  secret: RiverBlogSecretKeyForJWT2024MustBeLongEnoughForHS512AlgorithmSecurity
  expiration: 604800000  # 7天，单位：毫秒

# 文件上传配置
file:
  upload:
    path: ./uploads              # 相对路径，自动创建
    url-prefix: /files/
```

---

## 📦 状态管理

### 前端状态管理

项目使用 **React Context API** 进行全局状态管理：

```typescript
const { 
  // 用户状态
  user,              // 当前用户信息
  login,             // 登录方法
  logout,            // 登出方法
  updateAvatar,      // 更新头像
  
  // 认证模态框
  isAuthModalOpen,   // 模态框状态
  openAuthModal,     // 打开模态框
  closeAuthModal,    // 关闭模态框
  
  // 博客状态
  blogs,             // 博客列表
  addBlog,           // 添加博客
  deleteBlog,        // 删除博客
  toggleBlogStatus,  // 切换博客状态
  loadBlogs,         // 加载博客列表
  
  // 项目状态
  projects,          // 项目列表
  addProject,        // 添加项目
  deleteProject,     // 删除项目
} = useAppStore();
```

### 后端数据持久化

- **数据库**: MySQL 5.7+
- **ORM**: MyBatis 3.0.3
- **连接池**: HikariCP（Spring Boot 默认）
- **事务管理**: Spring `@Transactional`

---

## 🗺️ 路由结构

### 前端路由

| 路径 | 组件 | 权限 | 说明 |
|------|------|------|------|
| `/` | Home | 公开 | 首页 |
| `/blog` | Blog | 公开 | 博客列表和详情 |
| `/blog/write` | WriteBlog | 管理员 | 写博客 |
| `/works` | Works | 公开 | 作品展示 |
| `/works/write` | WriteProject | 管理员 | 添加作品 |
| `/about` | About | 公开 | 关于页面 |
| `/register` | Register | 公开 | 用户注册 |

### 后端 API

#### 认证相关 (`/api/auth`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/auth/login` | 公开 | 用户登录 |
| POST | `/auth/register` | 公开 | 用户注册 |
| POST | `/auth/admin` | 公开 | 管理员快速登录 |

#### 用户相关 (`/api/users`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/users/admin-profile` | 公开 | 获取管理员信息 |
| PUT | `/users/avatar` | 认证 | 更新用户头像 |

#### 博客相关 (`/api/blogs`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/blogs` | 公开 | 获取博客列表 |
| GET | `/blogs/{id}` | 公开 | 获取博客详情 |
| POST | `/blogs` | 认证 | 创建博客 |
| PUT | `/blogs/{id}` | 认证 | 更新博客 |
| DELETE | `/blogs/{id}` | 认证 | 删除博客 |
| PUT | `/blogs/{id}/status` | 认证 | 切换博客状态 |

#### 评论相关 (`/api/blogs/{postId}/comments`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/blogs/{postId}/comments` | 公开 | 获取评论列表 |
| POST | `/blogs/{postId}/comments` | 认证 | 发表评论 |

#### 项目相关 (`/api/projects`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/projects` | 公开 | 获取项目列表 |
| POST | `/projects` | 认证 | 创建项目 |
| DELETE | `/projects/{id}` | 认证 | 删除项目 |

#### 标签相关 (`/api/tags`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/tags` | 公开 | 获取所有标签 |

#### 文件相关 (`/api/files`)

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/files/upload` | 公开 | 上传文件 |
| GET | `/files/{filename}` | 公开 | 访问文件 |

---

## 📊 数据库设计

### 数据表

#### 用户表 (`users`)
```sql
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(50),
  `avatar` VARCHAR(500),
  `email` VARCHAR(100),
  `role` VARCHAR(20) DEFAULT 'user',
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 博客表 (`blog_posts`)
```sql
CREATE TABLE `blog_posts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `excerpt` TEXT,
  `content` LONGTEXT,
  `cover` VARCHAR(500),
  `views` INT DEFAULT 0,
  `comments` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 标签表 (`blog_tags`)
```sql
CREATE TABLE `blog_tags` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 博客标签关联表 (`blog_post_tags`)
```sql
CREATE TABLE `blog_post_tags` (
  `post_id` BIGINT NOT NULL,
  `tag_id` BIGINT NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`)
);
```

#### 评论表 (`blog_comments`)
```sql
CREATE TABLE `blog_comments` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `parent_id` BIGINT,
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 项目表 (`projects`)
```sql
CREATE TABLE `projects` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `image` VARCHAR(500),
  `link` VARCHAR(500),
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 内容图片表 (`blog_content_images`)
```sql
CREATE TABLE `blog_content_images` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## ⚠️ 注意事项

### 安全相关

1. **密码安全**: 使用 BCrypt 加密，不可逆
2. **JWT Token**: 7天有效期，存储在 localStorage
3. **CORS 配置**: 生产环境需配置允许的域名
4. **SQL 注入**: MyBatis 预编译防注入

### 部署相关

1. **数据库配置**: 修改 `application.yml` 中的数据库连接信息
2. **文件上传路径**: 使用相对路径 `./uploads`，自动创建
3. **环境变量**: 前端需配置 `VITE_API_BASE_URL`
4. **跨域配置**: 后端已配置 CORS，允许前端访问

### 开发相关

1. **权限控制**: 部分功能需要管理员权限
2. **路由模式**: 使用 BrowserRouter，需要服务器支持
3. **热更新**: Vite HMR 支持即时预览
4. **调试日志**: 控制台有详细的操作日志

### 数据相关

1. **数据持久化**: 所有数据存储在 MySQL 数据库
2. **初始数据**: 运行 `init-data.sql` 创建管理员账号
3. **图片存储**: 上传的文件保存在 `./uploads` 目录
4. **数据备份**: 定期备份数据库和上传文件

---

## 🔮 未来规划

### 功能增强

- [ ] **富文本编辑器** - 集成更强大的 Markdown 编辑器（如 Editor.js）
- [ ] **文章搜索** - 全文搜索功能
- [ ] **文章分类** - 除标签外的分类系统
- [ ] **文章收藏** - 用户收藏喜欢的文章
- [ ] **点赞功能** - 博客和评论点赞
- [ ] **阅读进度** - 文章阅读进度条
- [ ] **代码复制** - 代码块一键复制
- [ ] **目录导航** - 文章目录自动生成

### 用户体验

- [ ] **主题切换** - 深色/浅色模式
- [ ] **夜间模式** - 护眼模式
- [ ] **字体调节** - 阅读字体大小调节
- [ ] **阅读模式** - 沉浸式阅读
- [ ] **快捷键** - 键盘快捷操作

### 性能优化

- [ ] **图片懒加载** - 延迟加载图片
- [ ] **CDN 集成** - 静态资源 CDN 加速
- [ ] **缓存策略** - Redis 缓存热门数据
- [ ] **分页优化** - 虚拟滚动
- [ ] **代码分割** - 路由级代码分割

### SEO 优化

- [ ] **SSR 渲染** - Next.js 服务端渲染
- [ ] **站点地图** - 自动生成 sitemap.xml
- [ ] **元标签** - 完善的 meta 标签
- [ ] **结构化数据** - Schema.org 标记

### 扩展功能

- [ ] **第三方登录** - 微信/GitHub OAuth
- [ ] **邮件通知** - 评论/回复通知
- [ ] **订阅功能** - RSS/邮件订阅
- [ ] **数据统计** - 访问统计分析
- [ ] **PWA 支持** - 离线访问
- [ ] **国际化** - 多语言支持
- [ ] **移动 App** - React Native 移动端

---

## 🐛 常见问题

### 前端问题

**Q: 启动失败，提示端口被占用？**

A: 修改 `vite.config.ts` 中的端口号，或关闭占用 3000 端口的程序。

**Q: API 请求失败，提示 CORS 错误？**

A: 确保后端服务已启动，检查 `.env.local` 中的 `VITE_API_BASE_URL` 配置。

**Q: 图片上传失败？**

A: 检查图片大小（≤10MB）和格式（JPG/PNG），确保后端服务正常。

### 后端问题

**Q: 启动失败，提示数据库连接错误？**

A: 检查 MySQL 是否启动，`application.yml` 中的数据库配置是否正确。

**Q: 登录失败，提示密码错误？**

A: 确保运行了 `init-data.sql`，默认账号 `admin/admin123`。

**Q: 文件上传后无法访问？**

A: 检查 `uploads` 目录是否存在，权限是否正确。

## 📄 License

MIT License

Copyright (c) 2024 River

---

## 👨‍💻 作者

**River**

- GitHub: [@River](https://github.com/River)
- Email: river@example.com

如有问题或建议，欢迎提 Issue 或 PR！

---

## 🙏 鸣谢

感谢以下开源项目：

- [React](https://react.dev/) - UI 框架
- [Spring Boot](https://spring.io/projects/spring-boot) - 后端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [MyBatis](https://mybatis.org/) - 持久层框架
- [Lucide](https://lucide.dev/) - 图标库

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个 Star！⭐**

**📧 联系方式：river@example.com**

**🔗 项目地址：[River Personal Blog](https://github.com/River/river-personal-blog)**

Made with ❤️ by River

</div>
