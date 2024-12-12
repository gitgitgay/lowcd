/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { __debug__ } from '../__debug__'
import { startScrollOffset } from './drag-item'
import { updateAreaIndicator } from './virtual-area'

export const adjustScroll = () => {
    // 更新检测区域
    const pageContent = document.querySelector('.page-content') as HTMLElement
    pageContent.onscroll = () => {
        const scrollTop = pageContent.scrollTop - startScrollOffset.y
        if (__debug__) {
            updateAreaIndicator(scrollTop)
        }
    }
}
