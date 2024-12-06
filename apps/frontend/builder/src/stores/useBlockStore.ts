/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { create } from 'zustand'

import { BlockProtocol } from '@/protocols/block'

export type BlockTreeNode = Pick<BlockProtocol, 'id' | 'type'> & { children?: BlockTreeNode[] }

interface BlockStore {
    blockTree: BlockTreeNode[]
    blocks: Record<string, BlockProtocol>
    activeBlock: BlockProtocol | null
    initBlockTree: (blockTree: BlockTreeNode[]) => void
    initBlocks: (blocks: Record<string, BlockProtocol>) => void
    clearBlocks: () => void
    updateBlock: (block: BlockProtocol) => void
    setActiveBlock: (blockId: string) => void
    clearActiveBlock: () => void
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
    setActiveBlock: (blockId: string) => set({ activeBlock: get().blocks[blockId] }),
    clearActiveBlock: () => set({ activeBlock: null }),
}))
