# 第六步：编辑器主界面

## 1. 编辑器布局设计

编辑器采用三栏布局：左侧组件面板、中间画布、右侧设置面板。

## 2. 主编辑器组件

创建 `apps/frontend/builder/src/pages/Editor/index.tsx`:

```typescript
import { useEffect } from 'react'
import { EditorCanvas } from '@/components/EditorCanvas'
import { EditorLeftPanel } from '@/components/EditorLeftPanel'
import { EditorNavigator } from '@/components/EditorNavigator'
import { EditorSettingPanel } from '@/components/EditorSettingPanel'
import { useBlockStore } from '@/stores/useBlockStore'

// 示例数据
const blockTree = [
    {
        id: 'container-1',
        type: 'container',
        children: [
            {
                id: 'text-1',
                type: 'text',
            },
            {
                id: 'button-1',
                type: 'button',
            },
        ],
    },
]

const blocks = {
    'container-1': {
        id: 'container-1',
        title: '容器1',
        type: 'container',
        props: {
            layout: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            size: {
                width: 100,
                widthUnit: '%',
                height: 200,
                heightUnit: 'px',
            },
        },
    },
    'text-1': {
        id: 'text-1',
        title: '文本1',
        type: 'text',
        props: {
            text: 'Hello, World!',
            size: {
                width: 200,
                widthUnit: 'px',
                height: 'auto',
            },
        },
    },
    'button-1': {
        id: 'button-1',
        title: '按钮1',
        type: 'button',
        props: {
            text: '点击我',
            size: {
                width: 'auto',
                height: 'auto',
            },
        },
    },
}

export function Editor() {
    const initBlocks = useBlockStore(state => state.initBlocks)
    const initBlockTree = useBlockStore(state => state.initBlockTree)

    useEffect(() => {
        initBlockTree(blockTree)
        initBlocks(blocks)
    }, [initBlockTree, initBlocks])

    return (
        <div className="h-full">
            <EditorNavigator />
            <div className="flex flex-row h-[calc(100%-46px)]">
                <EditorLeftPanel />
                <EditorCanvas />
                <EditorSettingPanel />
            </div>
        </div>
    )
}
```

## 3. 编辑器导航栏

创建 `apps/frontend/builder/src/components/EditorNavigator/index.tsx`:

```typescript
import { Save, Eye, Settings } from 'lucide-react'

export function EditorNavigator() {
    return (
        <div className="editor-navigator h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold">页面编辑器</h1>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        保存
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        预览
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Save size={16} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Eye size={16} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Settings size={16} />
                </button>
            </div>
        </div>
    )
}
```

## 4. 编辑器画布

创建 `apps/frontend/builder/src/components/EditorCanvas/index.tsx`:

```typescript
import { useEffect } from 'react'
import { init } from '@miaoma-lowcode/layout-engine'
import { BlockTreeNode, useBlockStore } from '@/stores/useBlockStore'
import { BlockType } from '@/protocols/block'
import { BlockRenderer } from '../BlockRenderer'

export function EditorCanvas() {
    const blockTree = useBlockStore(state => state.blockTree)
    const insertBlock = useBlockStore(state => state.insertBlock)
    const moveBlock = useBlockStore(state => state.moveBlock)

    const renderLayout = (layout: BlockTreeNode[]) => {
        return layout?.map((child, index) => (
            <BlockRenderer key={child.id} node={child} index={index} />
        ))
    }

    useEffect(() => {
        init({
            onInsert(dragId, insertPayload) {
                if (!insertPayload || !insertPayload.position) return

                const [dragType = '', type = ''] = dragId.split('-')
                if (dragType === 'insert') {
                    insertBlock({
                        type: type as BlockType,
                        relativeBlockId: insertPayload.nodeId,
                        parentId: insertPayload.parentId,
                        position: insertPayload.position,
                    })
                    return
                }

                moveBlock({
                    blockId: dragId,
                    relativeBlockId: insertPayload.nodeId,
                    parentId: insertPayload.parentId,
                    position: insertPayload.position,
                })
            },
            onDrop(dragId, insertPayload) {
                if (!insertPayload) return

                const [dragType = '', type = ''] = dragId.split('-')
                if (dragType === 'insert') {
                    insertBlock({
                        type: type as BlockType,
                        parentId: insertPayload.parentId,
                    })
                    return
                }

                moveBlock({
                    blockId: dragId,
                    parentId: insertPayload.parentId,
                })
            },
        })
    }, [insertBlock, moveBlock])

    return (
        <div className="flex-1 bg-zinc-100">
            <div className="editor-canvas-simulator-outer relative h-[calc(100%-16px)] mx-[3%] my-2 rounded-xl bg-white overflow-hidden">
                <div className="editor-canvas-simulator">
                    <div className="flex flex-row items-center gap-2 h-10 px-4 bg-zinc-100">
                        <div className="size-3 rounded-full bg-red-500"></div>
                        <div className="size-3 rounded-full bg-yellow-500"></div>
                        <div className="size-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="page-content w-full h-full overflow-y-auto">
                    <div className="flex flex-col w-full page-content-inner max-w-[1024px] m-auto">
                        {renderLayout(blockTree)}
                    </div>
                </div>
            </div>
        </div>
    )
}
```

## 5. 左侧面板

创建 `apps/frontend/builder/src/components/EditorLeftPanel/index.tsx`:

```typescript
import { ComponentPanel } from './ComponentPanel'
import { LayerPanel } from './LayerPanel'

export function EditorLeftPanel() {
    return (
        <div className="editor-left-panel w-64 bg-white border-r border-gray-200">
            <ComponentPanel />
            <LayerPanel />
        </div>
    )
}
```

## 6. 图层面板

创建 `apps/frontend/builder/src/components/EditorLeftPanel/LayerPanel.tsx`:

```typescript
import { useBlockStore } from '@/stores/useBlockStore'
import { BlockTreeNode } from '@/stores/useBlockStore'

export function LayerPanel() {
    const blockTree = useBlockStore(state => state.blockTree)
    const activeBlock = useBlockStore(state => state.activeBlock)
    const setActiveBlock = useBlockStore(state => state.setActiveBlock)

    const renderLayerItem = (node: BlockTreeNode, depth = 0) => {
        const isActive = activeBlock?.id === node.id

        return (
            <div key={node.id} className="layer-item">
                <div
                    className={`layer-item-content p-2 cursor-pointer hover:bg-gray-100 ${
                        isActive ? 'bg-blue-100' : ''
                    }`}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                    onClick={() => setActiveBlock(node.id)}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-sm">{node.type}</span>
                    </div>
                </div>
                {node.children && (
                    <div className="layer-children">
                        {node.children.map(child => renderLayerItem(child, depth + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="layer-panel border-t border-gray-200">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">图层</h3>
                <div className="layer-list">
                    {blockTree.map(node => renderLayerItem(node))}
                </div>
            </div>
        </div>
    )
}
```

## 7. 路由配置

更新 `apps/frontend/builder/src/router/index.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/layout'
import { Editor } from '@/pages/Editor'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <div>首页</div>,
            },
            {
                path: 'editor/:id',
                element: <Editor />,
            },
        ],
    },
])
```

## 8. 主布局组件

创建 `apps/frontend/builder/src/layout/index.tsx`:

```typescript
import { Outlet } from 'react-router-dom'

export function Layout() {
    return (
        <div className="layout h-screen">
            <Outlet />
        </div>
    )
}
```

## 9. 样式配置

创建 `apps/frontend/builder/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.editor-canvas-simulator-outer {
    box-shadow:
        rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(62, 65, 86, 0.376) 0px 0px 1px 0px,
        rgba(62, 65, 86, 0.15) 0px 12px 24px 0px,
        rgba(62, 65, 86, 0.1) 0px 20px 40px 0px;
}

.block-renderer {
    position: relative;
}

.block-renderer:hover {
    outline: 1px dashed #3b82f6;
}

.block-renderer.selected {
    outline: 2px solid #3b82f6;
}

.container-block {
    position: relative;
    min-height: 50px;
}

.container-block:hover {
    background-color: #f0f9ff;
}
```
