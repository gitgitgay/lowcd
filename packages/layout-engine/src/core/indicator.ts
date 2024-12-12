/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { AreaType } from '../types/core'

export let indicator: HTMLElement | null = null

export const createIndicator = (hoveredArea: AreaType, scrollTop = 0) => {
    const { left, top, width, height } = hoveredArea

    if (document.querySelector('[data-indicator]')) {
        indicator = document.querySelector('[data-indicator]')
        // indicator?.remove();
    } else {
        indicator = document.createElement('div')
        indicator.setAttribute('data-indicator', 'true')
        // container.appendChild(indicator);
        document.body.appendChild(indicator)
    }

    if (!indicator) {
        return null
    }

    indicator.style.position = 'absolute'
    indicator.style.left = `${left}px`
    indicator.style.top = `${top - scrollTop}px`
    indicator.style.width = `${width}px`
    indicator.style.height = `${height}px`
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 1)'
}
