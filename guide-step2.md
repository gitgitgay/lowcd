# 第二步：核心协议设计

## 1. Block 协议设计

创建 `packages/core/src/protocols/block.ts`:

```typescript
// 基础 Block 协议
export interface BaseBlockProtocol {
    id: string
    title: string
    type: string
    props: {
        size?: SizeProtocol
        style?: StyleProtocol
    }
}

// 支持的 Block 类型
export const blockTypes = ['button', 'container', 'divider', 'icon', 'image', 'text'] as const
export type BlockType = (typeof blockTypes)[number]

// 各种 Block 的具体协议
export type TextBlockProtocol = BaseBlockProtocol & {
    type: 'text'
    props: {
        text: string
        size?: SizeProtocol
    }
}

export type ContainerBlockProtocol = BaseBlockProtocol & {
    type: 'container'
    props: {
        layout: LayoutProtocol
        size?: SizeProtocol
    }
}

// 其他 Block 协议...
export type BlockProtocol = TextBlockProtocol | ContainerBlockProtocol
// ... 其他类型
```

## 2. Layout 协议设计

创建 `packages/core/src/protocols/layout.ts`:

```typescript
// 布局协议
export interface LayoutProtocol {
    flexDirection: 'row' | 'column'
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch'
    gap?: number
}

// 尺寸协议
export interface SizeProtocol {
    width?: number | string
    widthUnit?: 'px' | '%' | 'auto'
    height?: number | string
    heightUnit?: 'px' | '%' | 'auto'
}

// 样式协议
export interface StyleProtocol {
    backgroundColor?: string
    color?: string
    fontSize?: number
    fontWeight?: string
    // ... 其他样式属性
}
```

## 3. Page 协议设计

创建 `packages/core/src/protocols/page.ts`:

```typescript
export interface PageProtocol {
    id: string
    title: string
    type: 'page'
    props: {
        layout: LayoutProtocol
        blocks: BlockProtocol[]
    }
}
```

## 4. 数据存储协议

创建 `packages/core/src/protocols/store.ts`:

```typescript
// Block 树节点
export type BlockTreeNode = Pick<BlockProtocol, 'id' | 'type'> & {
    children?: BlockTreeNode[]
}

// 应用数据
export interface AppData {
    id: string
    title: string
    pages: PageProtocol[]
    variables: VariableProtocol[]
}
```
