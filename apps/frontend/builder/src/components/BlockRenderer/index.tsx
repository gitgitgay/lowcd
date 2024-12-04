/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { useMemo } from 'react'

import { ButtonBlock } from '@/blocks/ButtonBlock'
import { ContainerBlock } from '@/blocks/ContainerBlock'
import { DividerBlock } from '@/blocks/DividerBlock'
import { IconBlock } from '@/blocks/IconBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { TextBlock } from '@/blocks/TextBlock'
import { ContainerProvider, useContainer } from '@/contexts/container'
import { BlockProtocol } from '@/protocols/block'
import { RectSize, RectSizeUnit } from '@/protocols/layout'

export interface BlockRendererProps {
    index: number
    data: BlockProtocol
}

const getWithUnit = (value: RectSize, unit?: RectSizeUnit) => {
    if (typeof value === 'number') {
        return `${value}${unit ?? 'px'}`
    }
    if (value === 'auto') {
        return value
    }
    if (value === 'full') {
        return '100%'
    }
    return value
}

export function BlockRenderer(props: BlockRendererProps) {
    const { index, data } = props
    const { containerId } = useContainer()

    let block = null
    switch (data.type) {
        case 'text': {
            block = <TextBlock data={data} />
            break
        }
        case 'image': {
            block = <ImageBlock data={data} />
            break
        }
        case 'button': {
            block = <ButtonBlock data={data} />
            break
        }
        case 'container': {
            block = <ContainerBlock data={data} />
            break
        }
        case 'divider': {
            block = <DividerBlock data={data} />
            break
        }
        case 'icon': {
            block = <IconBlock data={data} />
            break
        }
    }

    const styles = useMemo<React.CSSProperties>(() => {
        if (!data?.props) {
            return {}
        }
        const { size } = data.props

        const withUnitWidth = getWithUnit(size?.width ?? 'auto', size?.widthUnit)
        const withUnitHeight = getWithUnit(size?.height ?? 'auto', size?.heightUnit)

        return {
            width: withUnitWidth,
            height: withUnitHeight,
        }
    }, [data?.props])

    if (data.type === 'container') {
        return (
            <ContainerProvider containerId={data.id}>
                <div
                    style={styles}
                    data-node-index={index}
                    data-node={data.id}
                    data-direction={data.props?.layout?.flexDirection}
                    data-container={containerId}
                    data-node-count={data.children?.length}
                >
                    {block}
                </div>
            </ContainerProvider>
        )
    }

    return (
        <div style={styles} data-node-index={index} data-node={data.id} data-container={containerId}>
            {block}
        </div>
    )
}
