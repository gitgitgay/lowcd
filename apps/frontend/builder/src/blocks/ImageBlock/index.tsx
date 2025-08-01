/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { ImageBlockProtocol } from '@/protocols/block'

export interface ImageBlockProps {
    data?: ImageBlockProtocol
}

export function ImageBlock(props: ImageBlockProps) {
    const { data } = props
    return (
        <div>
            <img draggable={false} src={data?.props.src} alt={data?.title} />
        </div>
    )
}
