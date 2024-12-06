/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import React from 'react'

import { BlockRenderer } from '@/components/BlockRenderer'
import { ContainerProvider } from '@/contexts/container'
import { ContainerBlockProtocol } from '@/protocols/block'
import { BlockTreeNode, useBlockStore } from '@/stores/useBlockStore'

export interface ContainerBlockProps {
    data: ContainerBlockProtocol
    nodes?: BlockTreeNode[]
    children?: React.ReactNode
}

export function ContainerBlock(props: ContainerBlockProps) {
    const { nodes, data } = props
    const blockProps = useBlockStore(state => (state.blocks[data.id] as ContainerBlockProtocol).props)

    // 是否分布对齐
    const { isDistributedAlignment } = blockProps.layout

    const isRow = blockProps.layout.flexDirection === 'row'

    const alignX = isRow ? 'justifyContent' : 'alignItems'
    const alignY = isRow ? 'alignItems' : 'justifyContent'

    const styles: React.CSSProperties = {
        display: 'flex',
        flexDirection: blockProps.layout.flexDirection || 'row',
        [alignX]: isRow && isDistributedAlignment ? 'space-between' : blockProps.layout.justifyContent || 'flex-start',
        [alignY]: !isRow && isDistributedAlignment ? 'space-between' : blockProps.layout.alignItems || 'flex-start',
        gap: blockProps.layout.gap + 'px',
    }

    return (
        <div className="w-full h-full" style={styles}>
            <ContainerProvider containerId={data.id}>
                {nodes?.map((child, index) => {
                    return <BlockRenderer key={index} node={child} index={index} />
                })}
            </ContainerProvider>
        </div>
    )
}
