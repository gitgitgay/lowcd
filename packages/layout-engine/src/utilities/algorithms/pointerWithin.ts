/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Pointer, Rect } from '../../types/core'

export const pointerWithin = (pointer: Pointer, nodeRect: Rect) => {
    const { x, y } = pointer
    const { left, top, width, height } = nodeRect
    // 这里需要注意，如果是滚动的话，需要减去滚动的距离，在外部处理
    // return x >= left && x <= left + width && y >= top - scrollTop && y <= top - scrollTop + height
    return x >= left && x <= left + width && y >= top && y <= top + height
}
