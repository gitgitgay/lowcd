/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { insertPayload, startScrollOffset } from '../../core/drag-item'
import { createIndicator, indicator } from '../../core/indicator'
import { overlay } from '../../core/overlay'
import { nodeAreas } from '../../core/virtual-area'

export const dragMove = (event: any) => {
    if (!overlay.current) {
        return
    }
    // console.log('🚀 ~ move ~ event:', event)
    const prevHovered = document.querySelector('[data-hover]') as HTMLElement
    // console.log("🚀 ~ mouseMoveHandler ~ prevHovered:", prevHovered);
    if (prevHovered) {
        prevHovered.removeAttribute('data-hover')
        prevHovered.style.backgroundColor = ''
    }

    const deltaX = event.clientX - event.x0
    const deltaY = event.clientY - event.y0
    overlay.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`

    /**
     * 获取当前视窗滚动高度，用于计算碰撞检测区域
     */
    const pageContent = document.querySelector('.page-content') as HTMLElement
    const scrollTop = pageContent.scrollTop - startScrollOffset.y

    // 碰撞检测区域
    /**
     * 检测
     */
    // 通过和 nodeAreas 进行比对，判断当前鼠标位置是否在某个区域内
    const hovered = nodeAreas.find(area => {
        const { left, top, width, height } = area
        return (
            event.clientX >= left &&
            event.clientX <= left + width &&
            event.clientY >= top - scrollTop &&
            event.clientY <= top - scrollTop + height
        )
    })

    if (hovered) {
        insertPayload.current = {
            nodeId: hovered.id,
            parentId: hovered.containerId,
            position: hovered.position,
        }
        createIndicator(hovered, scrollTop)
    } else {
        insertPayload.current = null
        indicator?.remove()
    }
}
