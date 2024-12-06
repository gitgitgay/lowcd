/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import React from 'react'

/**
 * Block 不含单位尺寸
 */
export type RectSize = number | 'auto' | 'full'

/**
 * Block 尺寸单位
 */
export type RectSizeUnit = 'px' | '%'

/**
 * Block 尺寸
 */
export interface SizeProtocol {
    width: RectSize
    height: RectSize
    widthUnit?: RectSizeUnit
    heightUnit?: RectSizeUnit
}

/**
 * Block 布局
 */
export interface LayoutProtocol {
    flexDirection: 'row' | 'column'
    justifyContent: React.CSSProperties['justifyContent']
    alignItems: React.CSSProperties['alignItems']
    isDistributedAlignment?: boolean
    gap?: number
    padding?: [number, number, number, number]
}

/**
 * Block 样式
 */
export interface StyleProtocol {
    background?: string
}
