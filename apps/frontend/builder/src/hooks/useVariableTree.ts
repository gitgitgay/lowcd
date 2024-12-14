/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { useBlockStore } from '@/stores/useBlockStore'

export const useVariableTree = () => {
    const blocks = useBlockStore(state => state.blocks)

    // 一些 MOCK 信息，例如用户信息
    const currentUserInfo = {
        name: 'Heyi',
        age: 18,
    }

    const currentAppInfo = {
        name: '妙码学院',
        version: '1.0.0',
    }

    const titleBasedBlocks = new Map()

    Object.entries(blocks).forEach(([, block]) => {
        titleBasedBlocks.set(block.title, JSON.parse(JSON.stringify(block)))
    })

    return { currentUserInfo, currentAppInfo, ...Object.fromEntries(titleBasedBlocks.entries()) }
}
