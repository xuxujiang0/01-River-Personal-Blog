# 使用 JRE 运行时镜像
FROM eclipse-temurin:21-jre

WORKDIR /app

# 创建上传目录
RUN mkdir -p /app/uploads

# 从同级目录复制预编译的 jar 包
# 请确保在构建镜像前，已将 jar 包放置在 Dockerfile 同级目录
COPY river-blog-1.0.0.jar /app/app.jar

# 暴露端口
EXPOSE 8080

# 启动应用
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar"]
