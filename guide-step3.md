# 第三步：状态管理设计

## 1. 安装 Zustand

```bash
cd apps/frontend/builder
pnpm add zustand
```

## 2. Block Store 设计

创建 `apps/frontend/builder/src/stores/useBlockStore.ts`:

```typescript
import { create } from 'zustand'
import { BlockProtocol, BlockType } from '@/protocols/block'

export type BlockTreeNode = Pick<BlockProtocol, 'id' | 'type'> & {
    children?: BlockTreeNode[]
}

interface BlockStore {
    // 状态
    blockTree: BlockTreeNode[]
    blocks: Record<string, BlockProtocol>
    activeBlock: BlockProtocol | null

    // 初始化方法
    initBlockTree: (blockTree: BlockTreeNode[]) => void
    initBlocks: (blocks: Record<string, BlockProtocol>) => void

    // Block 操作方法
    updateBlock: (block: BlockProtocol) => void
    removeBlock: (blockId: string) => void
    insertBlock: (payload: {
        type: BlockType
        relativeBlockId?: string
        parentId: string
        position?: 'left' | 'right' | 'top' | 'bottom'
    }) => void
    moveBlock: (payload: {
        blockId: string
        relativeBlockId?: string
        parentId: string
        position?: 'left' | 'right' | 'top' | 'bottom'
    }) => void

    // 选中状态管理
    setActiveBlock: (blockId: string) => void
    clearActiveBlock: () => void
}

// 工具函数：查找节点
const findNode = (blockTree: BlockTreeNode[], id: string) => {
    let node: BlockTreeNode | undefined
    let parentId = ''

    const rec = (bt: BlockTreeNode[], id: string, pid?: string) => {
        for (const b of bt) {
            if (b.id === id) {
                node = b
                parentId = pid || ''
                return
            }
            if (b.children) {
                rec(b.children, id, b.id)
            }
        }
    }

    rec(blockTree, id)
    return { node, parentId }
}

export const useBlockStore = create<BlockStore>((set, get) => ({
    blockTree: [],
    blocks: {},
    activeBlock: null,

    initBlockTree: (blockTree: BlockTreeNode[]) => set({ blockTree }),
    initBlocks: (blocks: Record<string, BlockProtocol>) => set({ blocks }),

    updateBlock: (block: BlockProtocol) => {
        set(state => ({
            blocks: { ...state.blocks, [block.id]: block },
        }))
    },

    removeBlock: (blockId: string) => {
        set(state => {
            const newBlocks = { ...state.blocks }
            delete newBlocks[blockId]
            return { blocks: newBlocks }
        })
    },

    insertBlock(payload) {
        const { type, relativeBlockId, parentId, position } = payload

        // 生成默认的 block 数据
        const block = generateDefaultBlockData(type)

        set(state => ({
            blocks: { ...state.blocks, [block.id]: block },
        }))

        set(state => {
            const newBlockTree = [...state.blockTree]
            const { node: parentContainer } = findNode(newBlockTree, parentId)

            if (!parentContainer) return state

            const children = parentContainer.children || []

            if (!relativeBlockId) {
                parentContainer.children = [...children, block]
            } else {
                const relativeBlockIndex = children.findIndex(node => node.id === relativeBlockId)
                if (position === 'left' || position === 'top') {
                    parentContainer.children?.splice(relativeBlockIndex, 0, block)
                } else if (position === 'right' || position === 'bottom') {
                    parentContainer.children?.splice(relativeBlockIndex + 1, 0, block)
                }
            }

            return { blockTree: newBlockTree }
        })
    },

    moveBlock(payload) {
        const { blockId, relativeBlockId, parentId, position } = payload

        set(state => {
            const newBlockTree = [...state.blockTree]
            const { node: toParentContainer } = findNode(newBlockTree, parentId)
            const { node: block, parentId: fromParentId } = findNode(newBlockTree, blockId)
            const { node: fromParentContainer } = findNode(newBlockTree, fromParentId)

            if (!toParentContainer || !block) return state

            // 删除原来的 block
            const fromParentContainerChildren = fromParentContainer?.children || []
            const blockIndex = fromParentContainerChildren?.findIndex(node => node.id === blockId)
            fromParentContainerChildren.splice(blockIndex, 1)

            // 插入到新位置
            const toParentContainerChildren = toParentContainer.children || []

            if (!relativeBlockId) {
                toParentContainer.children = [...toParentContainerChildren, block]
            } else {
                const relativeBlockIndex = toParentContainerChildren.findIndex(node => node.id === relativeBlockId)
                if (position === 'left' || position === 'top') {
                    toParentContainerChildren.splice(relativeBlockIndex, 0, block)
                } else if (position === 'right' || position === 'bottom') {
                    toParentContainerChildren.splice(relativeBlockIndex + 1, 0, block)
                }
            }

            return { blockTree: newBlockTree }
        })
    },

    setActiveBlock: (blockId: string) => set({ activeBlock: get().blocks[blockId] }),
    clearActiveBlock: () => set({ activeBlock: null }),
}))
```

## 3. 默认 Block 数据生成

创建 `apps/frontend/builder/src/constants/defaultBlockData.ts`:

```typescript
import { BlockProtocol, BlockType } from '@/protocols/block'

export const generateDefaultBlockData = (type: BlockType): BlockProtocol => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const baseData = {
        id,
        title: `${type}${Date.now()}`,
        type,
        props: {
            size: {
                width: 'auto',
                height: 'auto',
            },
        },
    }

    switch (type) {
        case 'text':
            return {
                ...baseData,
                type: 'text',
                props: {
                    ...baseData.props,
                    text: '文本内容',
                },
            }
        case 'container':
            return {
                ...baseData,
                type: 'container',
                props: {
                    ...baseData.props,
                    layout: {
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    },
                },
            }
        case 'button':
            return {
                ...baseData,
                type: 'button',
                props: {
                    ...baseData.props,
                    text: '按钮',
                },
            }
        // ... 其他类型的默认数据
        default:
            return baseData as BlockProtocol
    }
}
```
