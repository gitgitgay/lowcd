/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { useMemo } from 'react'

import { DividerBlockProtocol } from '@/protocols/block'

export interface DividerBlockProps {
    data?: DividerBlockProtocol
}

export function DividerBlock(props: DividerBlockProps) {
    const { data } = props

    const styles = useMemo<React.CSSProperties>(() => {
        if (!data?.props) {
            return {}
        }
        const { size } = data.props

        return {
            width: (size?.width ?? 0) + (size?.widthUnit ?? 'px'),
            height: (size?.height ?? 0) + (size?.heightUnit ?? 'px'),
        }
    }, [data?.props])

    return <div className="w-full h-full bg-zinc-200" style={styles}></div>
}
