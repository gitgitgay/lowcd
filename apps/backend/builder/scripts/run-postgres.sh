#!/bin/bash

# 环境变量定义
POSTGRESQL_IMAGE="bitnami/postgresql:latest"
POSTGRESQL_CONTAINER="miaoma-postgresql"
POSTGRESQL_PORT="5432:5432"
# 这部分，在真实环境下，需要将 pwd 替换为实际的数据目录
POSTGRESQL_DATA_DIR="$(pwd)/postgresql_data"
POSTGRESQL_NETWORK="miaoma-network"

# PostgreSQL 配置
POSTGRESQL_USERNAME="miaoma"
POSTGRESQL_PASSWORD="miaoma123"
POSTGRESQL_DATABASE="lowcode"
POSTGRESQL_TIMEZONE="Asia/Shanghai"
POSTGRESQL_LOG_TIMEZONE="Asia/Shanghai"

# 创建网络（如果不存在）
if ! docker network ls | grep -q $POSTGRESQL_NETWORK; then
  docker network create --driver bridge $POSTGRESQL_NETWORK
  echo "Created network: $POSTGRESQL_NETWORK"
else
  echo "Network $POSTGRESQL_NETWORK already exists"
fi

# 停止并移除已有容器
if docker ps -a | grep -q $POSTGRESQL_CONTAINER; then
  docker stop $POSTGRESQL_CONTAINER
  docker rm $POSTGRESQL_CONTAINER
  echo "Removed existing container: $POSTGRESQL_CONTAINER"
fi

# 启动 PostgreSQL 容器
docker run -d --name $POSTGRESQL_CONTAINER --restart always \
  -p $POSTGRESQL_PORT \
  --network $POSTGRESQL_NETWORK \
  -v $POSTGRESQL_DATA_DIR:/bitnami/postgresql \
  -e POSTGRESQL_USERNAME=$POSTGRESQL_USERNAME \
  -e POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
  -e POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE \
  -e POSTGRESQL_TIMEZONE=$POSTGRESQL_TIMEZONE \
  -e POSTGRESQL_LOG_TIMEZONE=$POSTGRESQL_LOG_TIMEZONE \
  $POSTGRESQL_IMAGE

if [ $? -eq 0 ]; then
  echo "PostgreSQL container $POSTGRESQL_CONTAINER is up and running."
  echo "Access it at localhost:5432 with username '$POSTGRESQL_USERNAME'."
else
  echo "Failed to start PostgreSQL container."
fi