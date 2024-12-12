/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { __debug__ } from '../../__debug__'
console.log('🚀 ~ __debug__:', __debug__)
import { dragItem, startScrollOffset } from '../../core/drag-item'
import { overlay } from '../../core/overlay'
import { createAreaIndicator, generateAreas } from '../../core/virtual-area'

export const dragStart = (event: any) => {
    const pageContent = document.querySelector('.page-content') as HTMLElement
    const scrollTop = pageContent.scrollTop
    startScrollOffset.y = scrollTop
    // 样式基本处理
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
    // 创建碰撞区域
    generateAreas()
    if (__debug__) {
        // 创建区域指示
        createAreaIndicator()
    }
    // 创建指示器
    const dom = event.target as HTMLElement
    dragItem.dragId = dom.getAttribute('data-node') as string
    // const domRect = dom.getBoundingClientRect()
    // const overlay = dom.cloneNode(true) as HTMLDivElement
    // overlay.removeAttribute('data-node')
    const overlayDom = document.createElement('div')
    overlayDom.innerHTML = `
                    <p>${dragItem.dragId}</p>
                    <p>${dom.textContent}</p>
                `
    overlayDom.style.pointerEvents = 'none'
    overlayDom.style.position = 'absolute'
    // overlay.style.width = '36px'
    // overlay.style.height = '36px'
    // overlay.style.width = `${domRect?.width + 15}px`
    // overlay.style.maxHeight = '200px'
    // overlay.style.left = `${start.left}px`;
    // overlay.style.top = `${start.top}px`;
    overlayDom.style.left = `${event.x0 + 8}px`
    overlayDom.style.top = `${event.y0 + 12}px`
    overlayDom.style.borderRadius = '6px'
    overlayDom.style.border = '1px solid rgba(0, 0, 0, 0.1)'
    // overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
    overlayDom.style.backgroundColor = 'white'
    overlayDom.style.padding = '6px'
    document.body.appendChild(overlayDom)

    overlay.current = overlayDom
}
