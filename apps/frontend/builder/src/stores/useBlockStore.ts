/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { create } from 'zustand'

import { generateDefaultBlockData } from '@/constants/defaultBlockData'
import { BlockProtocol, BlockType } from '@/protocols/block'

export type BlockTreeNode = Pick<BlockProtocol, 'id' | 'type'> & { children?: BlockTreeNode[] }

interface BlockStore {
    blockTree: BlockTreeNode[]
    blocks: Record<string, BlockProtocol>
    activeBlock: BlockProtocol | null
    initBlockTree: (blockTree: BlockTreeNode[]) => void
    initBlocks: (blocks: Record<string, BlockProtocol>) => void
    clearBlocks: () => void
    updateBlock: (block: BlockProtocol) => void
    removeBlock: (blockId: string) => void
    setActiveBlock: (blockId: string) => void
    clearActiveBlock: () => void
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
}

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

/**
 * 选中的 block
 * @returns
 */
export const useBlockStore = create<BlockStore>((set, get) => ({
    blockTree: [],
    blocks: {},
    activeBlock: null,
    initBlockTree: (blockTree: BlockTreeNode[]) => set({ blockTree }),
    initBlocks: (blocks: Record<string, BlockProtocol>) => set({ blocks }),
    clearBlocks: () => set({ blocks: {} }),
    updateBlock: (block: BlockProtocol) => {
        set(state => {
            const newBlocks = { ...state.blocks, [block.id]: block }
            return { blocks: newBlocks }
        })
    },
    removeBlock: (blockId: string) => {
        set(state => {
            const newBlocks = { ...state.blocks }
            delete newBlocks[blockId]
            return { blocks: newBlocks }
        })
    },
    setActiveBlock: (blockId: string) => set({ activeBlock: get().blocks[blockId] }),
    clearActiveBlock: () => set({ activeBlock: null }),
    insertBlock(payload) {
        const { type, relativeBlockId, parentId, position } = payload

        /**
         * 生成默认的 block 数据
         */
        const block = generateDefaultBlockData(type)

        set(state => {
            const newBlocks = { ...state.blocks, [block.id]: block }
            return { blocks: newBlocks }
        })
        set(state => {
            const newBlockTree = [...state.blockTree]
            const { node: parentContainer } = findNode(newBlockTree, parentId)
            if (!parentContainer) {
                return state
            }
            const children = parentContainer.children || []
            // 如果不存在相对的 block，说明是直接 drop，直接追加到数组中
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
            if (!toParentContainer) {
                return state
            }
            const { node: block, parentId: fromParentId } = findNode(newBlockTree, blockId)
            const { node: fromParentContainer } = findNode(newBlockTree, fromParentId)
            if (!block) {
                return state
            }
            // 删除掉原来的 block
            const fromParentContainerChildren = fromParentContainer?.children || []
            const toParentContainerChildren = toParentContainer.children || []
            const blockIndex = fromParentContainerChildren?.findIndex(node => node.id === blockId)
            fromParentContainerChildren.splice(blockIndex, 1)
            // 如果不存在相对的 block，说明是直接 drop，直接追加到数组中
            if (!relativeBlockId) {
                toParentContainer.children = [...toParentContainerChildren, block]
            } else {
                // 再找寻新的位置插入 block
                const relativeBlockIndex = toParentContainerChildren.findIndex(node => node.id === relativeBlockId)
                // console.log('🚀 ~ moveBlock ~ relativeBlockIndex:', relativeBlockIndex)
                if (position === 'left' || position === 'top') {
                    toParentContainerChildren.splice(relativeBlockIndex, 0, block)
                } else if (position === 'right' || position === 'bottom') {
                    toParentContainerChildren.splice(relativeBlockIndex + 1, 0, block)
                }
            }

            return { blockTree: newBlockTree }
        })
    },
}))
