/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { useMemo } from 'react'

import { BlockRenderer } from '@/components/BlockRenderer'
import { ContainerProvider } from '@/contexts/container'
import { ContainerBlockProtocol } from '@/protocols/block'

export interface ContainerBlockProps {
    data: ContainerBlockProtocol
    children?: React.ReactNode
}

export function ContainerBlock(props: ContainerBlockProps) {
    const { data } = props

    const styles = useMemo<React.CSSProperties>(() => {
        if (!data?.props) {
            return {}
        }
        const { layout } = data.props
        return {
            display: 'flex',
            flexDirection: layout?.flexDirection || 'row',
            justifyContent: layout?.justifyContent || 'flex-start',
            alignItems: layout?.alignItems || 'flex-start',
        }
    }, [data?.props])

    return (
        <div style={styles}>
            <ContainerProvider containerId={data.id}>
                {data?.children?.map((child, index) => {
                    return <BlockRenderer key={index} data={child} index={index} />
                })}
            </ContainerProvider>
        </div>
    )
}
