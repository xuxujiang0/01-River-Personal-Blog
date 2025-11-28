# 🚀 后端运行指南

## ⚠️ 当前问题
Maven命令未找到，无法直接使用 `mvn spring-boot:run`

## 💡 解决方案（3选1）

### 方案1：安装Maven（推荐）⭐⭐⭐

#### 步骤1：下载Maven
访问：https://maven.apache.org/download.cgi
下载：apache-maven-3.9.x-bin.zip

#### 步骤2：解压并配置环境变量
1. 解压到：`C:\Program Files\Apache\maven`
2. 添加到系统环境变量：
   - 新建系统变量 `MAVEN_HOME`：`C:\Program Files\Apache\maven`
   - 编辑 `Path`，添加：`%MAVEN_HOME%\bin`

#### 步骤3：验证安装
```bash
mvn -version
```

#### 步骤4：启动项目
```bash
cd "d:\River\项目\01 River Personal Blog\backend"
mvn spring-boot:run
```

---

### 方案2：使用IntelliJ IDEA（最简单）⭐⭐⭐⭐⭐

#### 步骤1：打开项目
1. 启动 IntelliJ IDEA
2. 选择 `Open` 或 `Import Project`
3. 选择目录：`d:\River\项目\01 River Personal Blog\backend`
4. 选择 `Maven` 项目导入

#### 步骤2：等待依赖下载
IDEA会自动下载所有Maven依赖（首次可能需要5-10分钟）

#### 步骤3：运行项目
1. 找到 `RiverBlogApplication.java`
2. 右键点击文件
3. 选择 `Run 'RiverBlogApplication'`

✅ **这是最简单的方式！**

---

### 方案3：手动打包运行

#### 前提条件
需要先安装Maven（见方案1）

#### 步骤1：打包项目
```bash
cd "d:\River\项目\01 River Personal Blog\backend"
mvn clean package -DskipTests
```

#### 步骤2：运行jar包
```bash
java -jar target/river-blog-1.0.0.jar
```

---

## 🔧 启动前的准备工作

### 1. 确认MySQL已启动
```bash
# 检查MySQL服务
mysql -uroot -p -e "SELECT VERSION();"
```

### 2. 初始化数据库（首次运行）
```bash
cd "d:\River\项目\01 River Personal Blog"
mysql -uroot -p < backend/sql/schema.sql
mysql -uroot -p < backend/sql/init-data.sql
```

### 3. 修改数据库密码
编辑文件：`backend/src/main/resources/application.yml`

找到这一行并修改：
```yaml
spring:
  datasource:
    password: root  # 改为你的MySQL密码
```

---

## ✅ 启动成功的标志

看到以下输出表示成功：
```
========================================
🚀 River Blog Backend Started Successfully!
📝 API Documentation: http://localhost:8080/api
========================================
```

---

## 🧪 测试后端是否正常

### 方法1：浏览器测试
访问：http://localhost:8080/api/auth/admin

应该看到JSON返回（包含token和用户信息）

### 方法2：PowerShell测试
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/admin" -Method Post
```

---

## ❌ 常见错误及解决

### 错误1：端口8080被占用
```
Port 8080 is already in use
```

**解决方法**：
```powershell
# 查找占用8080端口的进程
netstat -ano | findstr :8080

# 结束进程（替换PID为上面查到的进程ID）
taskkill /PID <进程ID> /F
```

### 错误2：数据库连接失败
```
Access denied for user 'root'@'localhost'
```

**解决方法**：
1. 确认MySQL已启动
2. 检查 `application.yml` 中的密码是否正确
3. 确认数据库 `RIVER_BLOG` 已创建

### 错误3：找不到主类
```
Error: Could not find or load main class
```

**解决方法**：
使用 IntelliJ IDEA 运行，它会自动处理类路径

---

## 💻 推荐：使用IntelliJ IDEA

**为什么推荐IDE？**
1. ✅ 自动下载依赖
2. ✅ 一键运行
3. ✅ 实时日志查看
4. ✅ 断点调试
5. ✅ 代码提示

**下载地址**：
- IntelliJ IDEA Community（免费）：https://www.jetbrains.com/idea/download/
- 或使用 Eclipse、VS Code

---

## 📞 需要帮助？

如果你选择了某个方案但遇到问题，请告诉我：
1. 你选择的方案编号
2. 遇到的具体错误信息
3. 错误发生的步骤

我会继续帮你解决！👨‍💻
