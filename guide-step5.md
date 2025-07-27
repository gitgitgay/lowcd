# 第五步：Block 渲染器开发

## 1. Block 渲染器核心概念

Block 渲染器负责将协议数据渲染为实际的 React 组件，并处理拖拽、选中等交互。

## 2. 创建 Block 渲染器

创建 `apps/frontend/builder/src/components/BlockRenderer/index.tsx`:

```typescript
import { BlockTreeNode, useBlockStore } from '@/stores/useBlockStore'
import { BlockType } from '@/protocols/block'

interface BlockRendererProps {
    node: BlockTreeNode
    index: number
}

export function BlockRenderer({ node, index }: BlockRendererProps) {
    const blocks = useBlockStore(state => state.blocks)
    const activeBlock = useBlockStore(state => state.activeBlock)
    const setActiveBlock = useBlockStore(state => state.setActiveBlock)
    const clearActiveBlock = useBlockStore(state => state.clearActiveBlock)

    const block = blocks[node.id]
    if (!block) return null

    const isActive = activeBlock?.id === node.id

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveBlock(node.id)
    }

    const handleContainerClick = () => {
        clearActiveBlock()
    }

    const renderBlockContent = () => {
        switch (block.type) {
            case 'text':
                return <TextBlock block={block} />
            case 'container':
                return <ContainerBlock block={block} node={node} />
            case 'button':
                return <ButtonBlock block={block} />
            case 'image':
                return <ImageBlock block={block} />
            case 'icon':
                return <IconBlock block={block} />
            case 'divider':
                return <DividerBlock block={block} />
            default:
                return <div>Unknown block type: {block.type}</div>
        }
    }

    return (
        <div
            className={`block-renderer ${isActive ? 'ring-2 ring-blue-500' : ''}`}
            onClick={handleClick}
            data-drag-id={node.id}
            data-type={block.type}
            draggable
        >
            {renderBlockContent()}
        </div>
    )
}
```

## 3. 各种 Block 组件

### Text Block

创建 `apps/frontend/builder/src/blocks/TextBlock/index.tsx`:

```typescript
import { TextBlockProtocol } from '@/protocols/block'

interface TextBlockProps {
    block: TextBlockProtocol
}

export function TextBlock({ block }: TextBlockProps) {
    const { text, size } = block.props

    const style = {
        width: size?.width ? `${size.width}${size.widthUnit || 'px'}` : 'auto',
        height: size?.height ? `${size.height}${size.heightUnit || 'px'}` : 'auto',
    }

    return (
        <div
            className="text-block p-2 border border-dashed border-gray-300"
            style={style}
        >
            {text}
        </div>
    )
}
```

### Container Block

创建 `apps/frontend/builder/src/blocks/ContainerBlock/index.tsx`:

```typescript
import { ContainerBlockProtocol } from '@/protocols/block'
import { BlockTreeNode, useBlockStore } from '@/stores/useBlockStore'
import { BlockRenderer } from '@/components/BlockRenderer'

interface ContainerBlockProps {
    block: ContainerBlockProtocol
    node: BlockTreeNode
}

export function ContainerBlock({ block, node }: ContainerBlockProps) {
    const { layout, size } = block.props
    const blockTree = useBlockStore(state => state.blockTree)

    const style = {
        display: 'flex',
        flexDirection: layout.flexDirection,
        justifyContent: layout.justifyContent,
        alignItems: layout.alignItems,
        gap: layout.gap ? `${layout.gap}px` : undefined,
        width: size?.width ? `${size.width}${size.widthUnit || 'px'}` : 'auto',
        height: size?.height ? `${size.height}${size.heightUnit || 'px'}` : 'auto',
        minHeight: '50px',
        padding: '8px',
        border: '1px dashed #ccc',
        backgroundColor: '#f9f9f9',
    }

    const renderChildren = () => {
        if (!node.children) return null

        return node.children.map((child, index) => (
            <BlockRenderer key={child.id} node={child} index={index} />
        ))
    }

    return (
        <div
            className="container-block"
            style={style}
            data-drop-zone={node.id}
            data-parent-id={node.id}
        >
            {renderChildren()}
        </div>
    )
}
```

### Button Block

创建 `apps/frontend/builder/src/blocks/ButtonBlock/index.tsx`:

```typescript
import { ButtonBlockProtocol } from '@/protocols/block'

interface ButtonBlockProps {
    block: ButtonBlockProtocol
}

export function ButtonBlock({ block }: ButtonBlockProps) {
    const { text, size } = block.props

    const style = {
        width: size?.width ? `${size.width}${size.widthUnit || 'px'}` : 'auto',
        height: size?.height ? `${size.height}${size.heightUnit || 'px'}` : 'auto',
    }

    return (
        <button
            className="button-block px-4 py-2 bg-blue-500 text-white rounded"
            style={style}
        >
            {text}
        </button>
    )
}
```

## 4. 拖拽区域指示器

创建 `apps/frontend/builder/src/components/DropIndicator/index.tsx`:

```typescript
interface DropIndicatorProps {
    position: 'left' | 'right' | 'top' | 'bottom'
    visible: boolean
}

export function DropIndicator({ position, visible }: DropIndicatorProps) {
    if (!visible) return null

    const getIndicatorStyle = () => {
        const baseStyle = {
            position: 'absolute' as const,
            backgroundColor: '#3b82f6',
            zIndex: 1000,
        }

        switch (position) {
            case 'left':
                return {
                    ...baseStyle,
                    left: 0,
                    top: 0,
                    width: '2px',
                    height: '100%',
                }
            case 'right':
                return {
                    ...baseStyle,
                    right: 0,
                    top: 0,
                    width: '2px',
                    height: '100%',
                }
            case 'top':
                return {
                    ...baseStyle,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                }
            case 'bottom':
                return {
                    ...baseStyle,
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                }
        }
    }

    return <div style={getIndicatorStyle()} />
}
```

## 5. 组件面板

创建 `apps/frontend/builder/src/components/EditorLeftPanel/ComponentPanel.tsx`:

```typescript
import { blockTypes, BlockType } from '@/protocols/block'

export function ComponentPanel() {
    const handleDragStart = (e: React.DragEvent, type: BlockType) => {
        e.dataTransfer.setData('text/plain', `insert-${type}`)
        e.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <div className="component-panel w-64 bg-white border-r border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">组件库</h3>
            <div className="grid grid-cols-2 gap-2">
                {blockTypes.map(type => (
                    <div
                        key={type}
                        className="component-item p-3 border border-gray-200 rounded cursor-move hover:bg-gray-50"
                        draggable
                        onDragStart={(e) => handleDragStart(e, type)}
                        data-type={type}
                    >
                        <div className="text-sm font-medium">{getBlockDisplayName(type)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function getBlockDisplayName(type: BlockType): string {
    const names = {
        text: '文本',
        container: '容器',
        button: '按钮',
        image: '图片',
        icon: '图标',
        divider: '分割线',
    }
    return names[type] || type
}
```

## 6. 设置面板

创建 `apps/frontend/builder/src/components/EditorSettingPanel/index.tsx`:

```typescript
import { useBlockStore } from '@/stores/useBlockStore'

export function EditorSettingPanel() {
    const activeBlock = useBlockStore(state => state.activeBlock)
    const updateBlock = useBlockStore(state => state.updateBlock)

    if (!activeBlock) {
        return (
            <div className="setting-panel w-80 bg-white border-l border-gray-200 p-4">
                <div className="text-gray-500 text-center">请选择一个组件</div>
            </div>
        )
    }

    const handlePropertyChange = (key: string, value: any) => {
        const updatedBlock = {
            ...activeBlock,
            props: {
                ...activeBlock.props,
                [key]: value,
            },
        }
        updateBlock(updatedBlock)
    }

    return (
        <div className="setting-panel w-80 bg-white border-l border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">属性设置</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">标题</label>
                    <input
                        type="text"
                        value={activeBlock.title}
                        onChange={(e) => updateBlock({ ...activeBlock, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                {activeBlock.type === 'text' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">文本内容</label>
                        <textarea
                            value={activeBlock.props.text}
                            onChange={(e) => handlePropertyChange('text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            rows={3}
                        />
                    </div>
                )}

                {activeBlock.type === 'button' && (
                    <div>
                        <label className="block text-sm font-medium mb-1">按钮文本</label>
                        <input
                            type="text"
                            value={activeBlock.props.text}
                            onChange={(e) => handlePropertyChange('text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                )}

                {/* 尺寸设置 */}
                <div>
                    <label className="block text-sm font-medium mb-2">尺寸</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500">宽度</label>
                            <input
                                type="number"
                                value={activeBlock.props.size?.width || ''}
                                onChange={(e) => handlePropertyChange('size', {
                                    ...activeBlock.props.size,
                                    width: e.target.value,
                                })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">高度</label>
                            <input
                                type="number"
                                value={activeBlock.props.size?.height || ''}
                                onChange={(e) => handlePropertyChange('size', {
                                    ...activeBlock.props.size,
                                    height: e.target.value,
                                })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
```
