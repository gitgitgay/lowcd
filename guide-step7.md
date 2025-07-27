# 第七步：构建和部署

## 1. 构建配置

### Turbo 配置

创建 `turbo.json`:

```json
{
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": ["**/.env.*local"],
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
        },
        "build:watch": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
            "persistent": true
        },
        "dev": {
            "cache": false,
            "persistent": true
        },
        "lint": {
            "outputs": []
        },
        "typecheck": {
            "outputs": []
        }
    }
}
```

### Vite 配置

创建 `apps/frontend/builder/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
})
```

### TypeScript 配置

创建 `apps/frontend/builder/tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 2. 包管理配置

### 布局引擎包配置

创建 `packages/layout-engine/package.json`:

```json
{
    "name": "@miaoma-lowcode/layout-engine",
    "version": "1.0.0",
    "main": "./dist/index.js",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
        ".": {
            "import": "./dist/index.mjs",
            "require": "./dist/index.js",
            "types": "./dist/index.d.ts"
        }
    },
    "scripts": {
        "build": "tsup",
        "dev": "tsup --watch",
        "clean": "rm -rf dist"
    },
    "devDependencies": {
        "typescript": "^5.0.0",
        "tsup": "^8.0.0"
    }
}
```

创建 `packages/layout-engine/tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
})
```

## 3. 开发脚本

更新根目录 `package.json` 的 scripts:

```json
{
    "scripts": {
        "dev": "turbo dev",
        "build": "turbo build",
        "build:watch": "turbo build:watch",
        "clean": "run-s clean:build clean:caches",
        "clean:build": "pnpm --filter @miaoma/* clean",
        "clean:caches": "rimraf .turbo/cache **/*/.turbo",
        "clean:deps": "rimraf node_modules **/*/node_modules",
        "clean:all": "run-s clean:build clean:caches clean:deps",
        "lint": "turbo lint",
        "typecheck": "turbo typecheck"
    }
}
```

## 4. 环境配置

### 开发环境

创建 `.env.development`:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=妙码低代码平台
```

### 生产环境

创建 `.env.production`:

```env
VITE_API_URL=https://api.miaoma.com
VITE_APP_TITLE=妙码低代码平台
```

## 5. 部署配置

### Docker 配置

创建 `Dockerfile`:

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/apps/frontend/builder/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

创建 `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Docker Compose 配置

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
    frontend:
        build:
            context: .
            dockerfile: Dockerfile
        ports:
            - '80:80'
        depends_on:
            - backend

    backend:
        build:
            context: ./apps/backend
            dockerfile: Dockerfile
        ports:
            - '3001:3001'
        environment:
            - NODE_ENV=production
            - DATABASE_URL=postgresql://user:password@db:5432/miaoma
        depends_on:
            - db

    db:
        image: postgres:15
        environment:
            - POSTGRES_DB=miaoma
            - POSTGRES_USER=user
            - POSTGRES_PASSWORD=password
        volumes:
            - postgres_data:/var/lib/postgresql/data
        ports:
            - '5432:5432'

volumes:
    postgres_data:
```

## 6. CI/CD 配置

### GitHub Actions

创建 `.github/workflows/ci.yml`:

```yaml
name: CI/CD

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  cache: 'npm'

            - name: Install pnpm
              uses: pnpm/action-setup@v2
              with:
                  version: 8

            - name: Install dependencies
              run: pnpm install --frozen-lockfile

            - name: Type check
              run: pnpm typecheck

            - name: Lint
              run: pnpm lint

            - name: Build
              run: pnpm build

    deploy:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'

        steps:
            - uses: actions/checkout@v3

            - name: Deploy to production
              run: |
                  echo "Deploy to production server"
                  # 这里添加你的部署脚本
```

## 7. 性能优化

### 代码分割

更新 `apps/frontend/builder/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['@miaoma-lowcode/shadcn'],
                    engine: ['@miaoma-lowcode/layout-engine'],
                },
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
    },
})
```

### 缓存策略

创建 `apps/frontend/builder/public/_headers`:

```
/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## 8. 监控和日志

### 错误监控

创建 `apps/frontend/builder/src/utils/errorBoundary.tsx`:

```typescript
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // 这里可以发送错误到监控服务
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 text-center">
          <h2>出错了！</h2>
          <p>页面遇到了一个错误，请刷新页面重试。</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 9. 启动命令

```bash
# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 清理构建缓存
pnpm clean

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```
