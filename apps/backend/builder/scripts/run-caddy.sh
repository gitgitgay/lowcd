#!/bin/bash

# 环境变量定义
CADDY_HOME="/$(pwd)/infra/caddy"
ASSETES_HOME="/$(pwd)/application"
CADDY_CONTAINER="caddy"
CADDY_IMAGE="caddy:latest"
CADDY_PORTS="-p 443:443 -p 2019:2019 -p 80:80 -p 3000:3000 -p 3001:3001"

# 检查并创建必要的目录
mkdir -p $CADDY_HOME/.cache
mkdir -p $CADDY_HOME/.config
mkdir -p $CADDY_HOME/logs
mkdir -p $ASSETES_HOME

# 停止并移除旧容器
if docker ps -a | grep -q $CADDY_CONTAINER; then
  docker stop $CADDY_CONTAINER
  docker rm $CADDY_CONTAINER
  echo "Removed existing container: $CADDY_CONTAINER"
fi

# 启动 Caddy 容器
docker run -d --name $CADDY_CONTAINER --restart always \
  -v $CADDY_HOME/Caddyfile:/caddy/Caddyfile \
  -v $CADDY_HOME/.cache:/root/.local/share/caddy \
  -v $CADDY_HOME/.config:/root/.config \
  -v $CADDY_HOME/logs:/logs \
  -v $ASSETES_HOME:/frontend \
  $CADDY_PORTS \
  $CADDY_IMAGE \
  caddy run --resume --config /caddy/Caddyfile

# 启动状态检查
if [ $? -eq 0 ]; then
  echo "Caddy container $CADDY_CONTAINER is up and running."
  echo "Logs are stored in $CADDY_HOME/logs."
else
  echo "Failed to start Caddy container."
fi