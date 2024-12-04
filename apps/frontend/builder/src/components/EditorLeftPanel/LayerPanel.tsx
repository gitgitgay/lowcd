/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { blocksIconMap } from '@/icons/blocks'
interface Layer {
    id: string
    type: keyof typeof blocksIconMap
    name: string
    children?: Layer[]
}
const layers: Layer[] = [
    {
        id: 'text-xag1fa',
        type: 'text',
        name: '文本',
    },
    {
        id: 'container-xag1fa',
        type: 'container',
        name: '容器',
        children: [
            {
                id: 'text-xag1fa',
                type: 'text',
                name: '文本',
            },
        ],
    },
]

const withLevelFlattenLayers = (layers: Layer[], level = 0) => {
    return layers.reduce(
        (acc, layer) => {
            acc.push({
                ...layer,
                level,
            })

            if (layer.children) {
                acc.push(...withLevelFlattenLayers(layer.children, level + 1))
            }

            return acc
        },
        [] as (Layer & { level: number })[]
    )
}

export function LayerPanel() {
    const flattenLayers = withLevelFlattenLayers(layers)
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
                    >
                        <div className="size-4 mr-3">
                            <Icon />
                        </div>
                        {layer.name}
                    </div>
                )
            })}
        </div>
    )
}
