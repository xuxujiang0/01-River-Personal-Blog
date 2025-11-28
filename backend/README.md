# River Personal Blog - Backend API

## 📋 项目说明

这是 River Personal Blog 的后端 API 服务，使用 Spring Boot 3 + MyBatis + MySQL 5.7 构建。

## 🛠️ 技术栈

- **JDK**: 21
- **Spring Boot**: 3.2.0
- **MyBatis**: 3.0.3
- **MySQL**: 5.7
- **JWT**: 0.12.3
- **Lombok**: 自动生成代码
- **Maven**: 项目管理

## 📁 项目结构

```
backend/
├── src/main/java/com/river/blog/
│   ├── RiverBlogApplication.java          # 主启动类
│   ├── common/                             # 公共类
│   │   ├── Result.java                     # 统一返回结果
│   │   └── PageResult.java                 # 分页结果
│   ├── config/                             # 配置类
│   │   ├── SecurityConfig.java             # Security配置
│   │   ├── CorsConfig.java                 # 跨域配置
│   │   └── FileUploadConfig.java           # 文件上传配置
│   ├── controller/                         # 控制器
│   │   ├── AuthController.java             # 认证控制器
│   │   ├── BlogPostController.java         # 博客控制器
│   │   ├── ProjectController.java          # 项目控制器
│   │   └── FileController.java             # 文件上传控制器
│   ├── service/                            # 服务层
│   │   ├── UserService.java
│   │   ├── BlogPostService.java
│   │   ├── ProjectService.java
│   │   └── FileService.java
│   ├── mapper/                             # MyBatis Mapper
│   │   ├── UserMapper.java
│   │   ├── BlogPostMapper.java
│   │   ├── ProjectMapper.java
│   │   └── BlogTagMapper.java
│   ├── entity/                             # 实体类
│   │   ├── User.java
│   │   ├── BlogPost.java
│   │   └── Project.java
│   ├── dto/                                # 数据传输对象
│   │   ├── LoginRequest.java
│   │   ├── BlogPostDTO.java
│   │   └── ProjectDTO.java
│   ├── util/                               # 工具类
│   │   ├── JwtUtil.java                    # JWT工具
│   │   └── PasswordUtil.java               # 密码加密工具
│   └── filter/                             # 过滤器
│       └── JwtAuthenticationFilter.java    # JWT认证过滤器
├── src/main/resources/
│   ├── application.yml                     # 配置文件
│   └── mapper/                             # MyBatis XML
│       ├── UserMapper.xml
│       ├── BlogPostMapper.xml
│       └── ProjectMapper.xml
├── sql/                                    # SQL脚本
│   ├── schema.sql                          # 表结构DDL
│   └── init-data.sql                       # 初始化数据
└── pom.xml                                 # Maven配置

```

## 🚀 快速开始

### 1. 环境准备

- JDK 21
- Maven 3.8+
- MySQL 5.7
- IDE (推荐 IntelliJ IDEA)

### 2. 数据库初始化

```bash
# 执行DDL创建表结构
mysql -uroot -p < sql/schema.sql

# 执行初始化数据
mysql -uroot -p < sql/init-data.sql
```

### 3. 修改配置

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/RIVER_BLOG
    username: root
    password: your_password  # 修改为你的MySQL密码
```

### 4. 启动项目

```bash
# 使用Maven启动
mvn spring-boot:run

# 或者在IDE中运行 RiverBlogApplication.java
```

启动成功后访问：http://localhost:8080/api

## 📝 API 文档

### 认证相关

#### 1. 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "站长本人",
      "avatar": "https://...",
      "role": "admin"
    }
  }
}
```

#### 2. 管理员登录（简化版）
```
POST /api/auth/admin
Response: 同上
```

### 博客相关

#### 1. 获取博客列表
```
GET /api/blogs?page=1&size=10&status=published

Response:
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 6,
    "page": 1,
    "size": 10
  }
}
```

#### 2. 获取博客详情
```
GET /api/blogs/{id}
```

#### 3. 创建博客（需要认证）
```
POST /api/blogs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "文章标题",
  "excerpt": "文章摘要",
  "content": "<p>文章内容</p>",
  "cover": "封面图URL",
  "tags": ["React", "TypeScript"],
  "status": "published"
}
```

#### 4. 更新博客（需要认证）
```
PUT /api/blogs/{id}
Authorization: Bearer {token}
```

#### 5. 删除博客（需要认证）
```
DELETE /api/blogs/{id}
Authorization: Bearer {token}
```

#### 6. 切换博客状态（需要认证）
```
PUT /api/blogs/{id}/status
Authorization: Bearer {token}
```

### 项目作品相关

#### 1. 获取项目列表
```
GET /api/projects
```

#### 2. 创建项目（需要认证）
```
POST /api/projects
Authorization: Bearer {token}

{
  "title": "项目标题",
  "description": "项目描述",
  "image": "项目图片URL",
  "link": "项目链接",
  "techStack": ["React", "Node.js"]
}
```

#### 3. 删除项目（需要认证）
```
DELETE /api/projects/{id}
Authorization: Bearer {token}
```

### 文件上传

#### 上传图片
```
POST /api/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary)

Response:
{
  "code": 200,
  "data": {
    "url": "/api/files/xxxxx.jpg",
    "filename": "xxxxx.jpg"
  }
}
```

## 🔐 认证说明

### JWT Token

所有需要认证的接口都需要在请求头中携带 JWT Token：

```
Authorization: Bearer {token}
```

### 默认账户

- **管理员**
  - 用户名: `admin`
  - 密码: `admin123`
  - 角色: `admin`

- **普通用户**
  - 用户名: `testuser`
  - 密码: `user123`
  - 角色: `user`

## 📦 构建部署

### 打包

```bash
mvn clean package
```

生成的jar包位于 `target/river-blog-1.0.0.jar`

### 运行

```bash
java -jar target/river-blog-1.0.0.jar
```

## 🔧 配置说明

### 数据库配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/RIVER_BLOG
    username: root
    password: root
```

### JWT配置

```yaml
jwt:
  secret: RiverBlogSecretKeyForJWT2024...  # 修改为自己的密钥
  expiration: 604800000  # 7天
```

### 文件上传配置

```yaml
file:
  upload:
    path: d:/River/项目/01 River Personal Blog/backend/uploads/
    url-prefix: /api/files/
```

## ⚠️ 注意事项

1. **密码加密**: 所有密码使用 BCrypt 加密
2. **CORS配置**: 已配置允许 `http://localhost:3000` 跨域
3. **文件上传**: 默认限制 10MB
4. **JWT密钥**: 生产环境请修改 `jwt.secret`
5. **数据库**: 确保 MySQL 使用 UTF-8MB4 字符集

## 🐛 常见问题

### 1. 数据库连接失败
- 检查 MySQL 是否启动
- 检查数据库名、用户名、密码是否正确
- 检查防火墙设置

### 2. JWT Token 无效
- 检查 Token 是否过期
- 检查 `jwt.secret` 配置是否正确

### 3. 文件上传失败
- 检查上传路径是否存在
- 检查文件大小是否超过限制

## 📄 License

MIT License
