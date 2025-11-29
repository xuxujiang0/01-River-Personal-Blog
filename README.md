# 🌟 River Personal Blog

<div align="center">

一个现代化的个人博客系统，采用暗黑霓虹主题设计，提供博客写作、作品展示等功能。

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 项目简介

这是一个基于 React + TypeScript + Vite 构建的现代化个人博客系统。项目采用暗黑主题配合霓虹色彩设计，提供流畅的动画效果和优雅的用户体验。

### ✨ 核心特性

- 🎨 **暗黑霓虹主题** - 独特的视觉设计，荧光绿高亮配色
- 📝 **博客管理系统** - 支持创建、编辑、删除博客文章
- 🎯 **作品展示** - 展示个人项目和技术作品
- 🔐 **管理员登录** - 完全管理权限
- 🎮 **交互式组件** - 包含游戏模块等趣味互动元素
- 📱 **响应式设计** - 完美适配移动端和桌面端
- ⚡ **快速开发体验** - Vite 提供极速的热更新

---

## 🛠️ 技术栈

### 核心框架
- **React 19.2.0** - 前端 UI 框架
- **TypeScript 5.8.2** - 类型安全的 JavaScript
- **Vite 6.2.0** - 下一代前端构建工具

### 路由与状态
- **React Router DOM 7.9.6** - 单页应用路由管理
- **React Context API** - 全局状态管理

### UI 与样式
- **Tailwind CSS** - 原子化 CSS 框架
- **Lucide React** - 精美的图标库

### 开发工具
- **@vitejs/plugin-react** - React 快速刷新支持
- **@types/node** - Node.js 类型定义

---

## 📁 项目结构

```
frontend/
├── components/              # 组件目录
│   ├── AuthModal.tsx       # 登录认证模态框
│   ├── BackToTop.tsx       # 返回顶部按钮
│   ├── GameModules.tsx     # 游戏模块组件
│   ├── Navbar.tsx          # 导航栏组件
│   ├── TankFooter.tsx      # 页脚组件
│   └── TankTrack.tsx       # 坦克履带特效
├── pages/                   # 页面目录
│   ├── Home.tsx            # 首页
│   ├── Blog.tsx            # 博客列表页
│   ├── WriteBlog.tsx       # 写博客页面
│   ├── Works.tsx           # 作品展示页
│   ├── WriteProject.tsx    # 添加作品页面
│   └── About.tsx           # 关于页面
├── App.tsx                  # 应用主入口
├── index.tsx               # React 渲染入口
├── store.tsx               # 全局状态管理
├── types.ts                # TypeScript 类型定义
├── vite.config.ts          # Vite 配置文件
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖配置
└── .env.local              # 环境变量配置
```

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **npm** 或 **yarn** 或 **pnpm**

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd "01 River Personal Blog/frontend"
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

编辑 `.env.local` 文件，设置 Gemini API Key：
```env
GEMINI_API_KEY=你的实际API密钥
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**

打开浏览器访问：`http://localhost:3000`

### 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

---

## 📚 功能模块

### 1. 首页 (Home)
- 欢迎页面，展示个人介绍
- 导航到博客和作品页面
- 包含交互式游戏模块

### 2. 博客系统 (Blog)
- 📄 **博客列表** - 展示所有已发布的博客文章
- ✍️ **写博客** - Markdown 编辑器支持（需管理员权限）
- 🏷️ **标签分类** - 多标签分类管理
- 👁️ **阅读统计** - 浏览量和评论数统计
- 🔒 **状态管理** - 支持发布/隐藏状态切换

### 3. 作品展示 (Works)
- 🎨 **项目展示** - 网格布局展示个人作品
- ➕ **添加作品** - 管理员可添加新项目
- 🔧 **技术栈展示** - 显示项目使用的技术

### 4. 用户认证 (Auth)
- 👨‍💼 **管理员登录** - 完全管理权限

### 5. 关于页面 (About)
- 个人信息展示
- 联系方式等

---

## 🎨 设计特色

### 视觉风格
- **主题色**: 暗黑背景 `#050505`
- **高亮色**: 霓虹绿 `#39ff14`
- **渐变效果**: 从 indigo 到 cyan、purple 到 pink 的渐变
- **模糊装饰**: 彩色半透明圆形背景

### 动画效果
- **fadeIn** - 淡入动画（0.5s）
- **fadeUp** - 上浮淡入动画（0.8s）
- **hover** - 按钮悬停缩放效果
- **transition** - 流畅的过渡动画

---

## 🔧 配置说明

### Vite 配置

```typescript
// vite.config.ts
{
  server: {
    port: 3000,           // 开发服务器端口
    host: '0.0.0.0',      // 允许外部访问
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),  // @ 别名
    }
  }
}
```

### TypeScript 配置

- **目标**: ES2022
- **模块**: ESNext
- **JSX**: react-jsx
- **严格模式**: 启用

---

## 📦 状态管理

项目使用 React Context API 进行全局状态管理：

```typescript
const { 
  user,              // 当前用户
  login,             // 登录方法
  logout,            // 登出方法
  blogs,             // 博客列表
  addBlog,           // 添加博客
  deleteBlog,        // 删除博客
  toggleBlogStatus,  // 切换博客状态
  projects,          // 项目列表
  addProject,        // 添加项目
  deleteProject,     // 删除项目
} = useAppStore();
```

---

## 🗺️ 路由结构

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/blog` | Blog | 博客列表 |
| `/blog/write` | WriteBlog | 写博客（需登录）|
| `/works` | Works | 作品展示 |
| `/works/write` | WriteProject | 添加作品（需登录）|
| `/about` | About | 关于页面 |

---

## ⚠️ 注意事项

1. **数据持久化**: 当前版本所有数据存储在内存中，刷新页面会丢失数据。如需持久化，请考虑接入后端 API 或使用 LocalStorage。

2. **API 集成**: 项目配置了 Gemini API Key，但需要在代码中实际调用 API。

3. **路由模式**: 使用 HashRouter，适合静态部署，URL 会包含 `#` 符号。如需服务器端路由，可改用 BrowserRouter。

4. **权限控制**: 部分功能需要管理员权限，请先以管理员身份登录。

---

## 🔮 未来规划

- [ ] 接入后端 API，实现数据持久化
- [ ] 集成 Markdown 编辑器
- [ ] 添加评论系统
- [ ] 实现文章搜索功能
- [ ] 添加深色/浅色主题切换
- [ ] SEO 优化
- [ ] PWA 支持
- [ ] 国际化支持

---

## 📄 License

MIT License

---

## 👨‍💻 作者

**River**

如有问题或建议，欢迎提 Issue 或 PR！

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个 Star！⭐**

</div>
