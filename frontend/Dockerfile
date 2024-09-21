# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将构建产物复制到 Nginx 用来提供静态文件的文件夹中
COPY dist/ /usr/share/nginx/html/

# 暴露容器的 80 端口
EXPOSE 80

# 使用 Nginx 默认的启动命令
CMD ["nginx", "-g", "daemon off;"]