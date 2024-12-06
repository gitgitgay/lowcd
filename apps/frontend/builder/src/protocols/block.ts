/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { LayoutProtocol, SizeProtocol, StyleProtocol } from './layout'

export const blockTypes = ['button', 'container', 'divider', 'icon', 'image', 'text'] as const

export type BlockType = (typeof blockTypes)[number]

/**
 * 基础 Block 协议
 */
export interface BaseBlockProtocol {
    id: string
    title: string
    type: string
    props: {
        size?: SizeProtocol
        style?: StyleProtocol
    }
}

/**
 * 文本 Block 协议
 */
export type TextBlockProtocol = BaseBlockProtocol & {
    type: 'text'
    props: {
        text: string
    }
}

/**
 * 图片 Block 协议
 */
export type ImageBlockProtocol = BaseBlockProtocol & {
    type: 'image'
    props: {
        src: string
    }
}

/**
 * 图标 Block 协议
 */
export type IconBlockProtocol = BaseBlockProtocol & {
    type: 'icon'
    props: {
        icon: string
    }
}

/**
 * 按钮 Block 协议
 */
export type ButtonBlockProtocol = BaseBlockProtocol & {
    type: 'button'
    props: {
        text: string
    }
}

/**
 * 分割线 Block 协议
 */
export type DividerBlockProtocol = BaseBlockProtocol & {
    type: 'divider'
}

/**
 * 容器 Block 协议
 */
export type ContainerBlockProtocol = BaseBlockProtocol & {
    type: 'container'
    // children: BlockProtocol[]
    props: {
        layout: LayoutProtocol
    }
}

/**
 * Block 协议
 */
export type BlockProtocol =
    | TextBlockProtocol
    | ImageBlockProtocol
    | IconBlockProtocol
    | ButtonBlockProtocol
    | DividerBlockProtocol
    | ContainerBlockProtocol
