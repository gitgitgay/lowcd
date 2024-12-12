/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { blocksIconMap } from '@/icons/blocks'
import { BlockProtocol } from '@/protocols/block'
import { BlockTreeNode, useBlockStore } from '@/stores/useBlockStore'

const withLevelFlattenLayers = (blockTree: BlockTreeNode[], blocks: Record<string, BlockProtocol>, level = 0) => {
    return blockTree.reduce(
        (acc, layer) => {
            acc.push({
                ...layer,
                title: blocks[layer.id].title,
                level,
            })

            if (layer.children) {
                acc.push(...withLevelFlattenLayers(layer.children, blocks, level + 1))
            }

            return acc
        },
        [] as (BlockTreeNode & { title: string; level: number })[]
    )
}

export function LayerPanel() {
    const blocks = useBlockStore(state => state.blocks)
    const blockTree = useBlockStore(state => state.blockTree)
    const setActiveBlock = useBlockStore(state => state.setActiveBlock)

    const flattenLayers = withLevelFlattenLayers(blockTree, blocks, 0)

    const scrollToBlock = (id: string) => {
        setActiveBlock(id)
        document.querySelector('[data-node="' + id + '"]')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }

    const highlightBlock = (id: string) => {
        document.querySelector('[data-node="' + id + '"]')?.classList.add('outline', 'outline-purple-300')
    }

    const unhighlightBlock = (id: string) => {
        document.querySelector('[data-node="' + id + '"]')?.classList.remove('outline', 'outline-purple-300')
    }

    return (
        <div className="w-full h-full p-2">
            <div className="p-2 mb-1 text-sm font-semibold">物料图层</div>
            {flattenLayers.map(layer => {
                const Icon = blocksIconMap[layer.type]
                return (
                    <div
                        key={layer.id}
                        className="flex items-center px-2 h-[32px] mb-1 rounded-md text-sm text-zinc-500 cursor-pointer hover:text-foreground hover:bg-muted hover:shadow-sm"
                        style={{
                            paddingLeft: `${layer.level * 8 + 8}px`,
                        }}
                        onClick={() => scrollToBlock(layer.id)}
                        onMouseEnter={() => highlightBlock(layer.id)}
                        onMouseLeave={() => unhighlightBlock(layer.id)}
                    >
                        <div className="size-4 mr-3">
                            <Icon />
                        </div>
                        <div className="flex flex-row items-center">
                            {layer.title}
                            <span className="ml-2 text-xs text-zinc-400">{layer.id}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
