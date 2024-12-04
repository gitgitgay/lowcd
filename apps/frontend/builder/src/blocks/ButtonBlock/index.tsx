/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { ButtonBlockProtocol } from '@/protocols/block'

export interface ButtonBlockProps {
    data?: ButtonBlockProtocol
}

export function ButtonBlock(props: ButtonBlockProps) {
    const { data } = props

    return <button className="px-2 py-1 text-sm rounded-md bg-primary text-primary-foreground">{data?.props.text}</button>
}
