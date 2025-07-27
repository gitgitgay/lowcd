# 第一步：项目初始化

## 1. 创建项目根目录

```bash
mkdir miaoma-lowcode
cd miaoma-lowcode
```

## 2. 初始化 package.json

```bash
pnpm init
```

## 3. 配置 pnpm workspace

创建 `pnpm-workspace.yaml`:

```yaml
packages:
    - 'apps/*'
    - 'packages/*'
```

## 4. 安装核心依赖

```bash
pnpm add -D typescript @types/node turbo rimraf
pnpm add -D eslint @eslint/js typescript-eslint
pnpm add -D prettier lint-staged husky
```

## 5. 创建基础目录结构

```bash
mkdir -p apps/frontend/builder
mkdir -p apps/backend
mkdir -p packages/layout-engine
mkdir -p packages/variable-editor
mkdir -p packages/shadcn
```

## 6. 配置 TypeScript

创建 `tsconfig.json`:

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
        "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
}
```
