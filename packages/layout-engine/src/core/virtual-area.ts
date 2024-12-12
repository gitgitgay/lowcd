/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { AREA_OFFSET, AREA_SIZE } from '../constants/virtual-area'
import { AreaType } from '../types/core'
import { dragItem } from './drag-item'

export let nodeAreas: AreaType[] = []

export const generateAreas = () => {
    // 使用层序遍历，将获得的 nodes 处理生成区域，追加到 nodeAreas 中
    // 1. 获取所有 node
    const nodes = document.querySelectorAll('[data-node]')
    const nodesMap = new Map<string, HTMLElement>()
    nodes.forEach(node => {
        const dom = node as HTMLElement
        const nodeId = dom.getAttribute('data-node')
        if (nodeId) {
            nodesMap.set(nodeId, dom)
        }
    })
    // 2. 层级遍历，通过节点上 containerId、direction、nodeId 生成区域
    const queue = [...nodes]
    while (queue.length) {
        const node = queue.shift() as HTMLElement
        const containerId = node.getAttribute('data-container')
        const nodeId = node.getAttribute('data-node')

        const parentContainer = nodesMap.get(containerId as string)
        const parentContainerId = parentContainer?.getAttribute('data-node')
        const parentContainerDirection = parentContainer?.getAttribute('data-direction')

        if (!containerId || !nodeId || !parentContainer || !parentContainerId || nodeId === dragItem.dragId) {
            continue
        }

        const { left, right, top, bottom } = node.getBoundingClientRect()
        const { width: pWidth, height: pHeight, left: pLeft, top: pTop } = parentContainer.getBoundingClientRect()

        const isRow = parentContainerDirection === 'row'
        // const isFirst = node.getAttribute("data-node-index") === "0";
        const nodeIndex = node.getAttribute('data-node-index')
        const nodeCount = parentContainer.getAttribute('data-node-count')
        const isLast = nodeIndex && nodeCount && Number(nodeIndex) === Number(nodeCount) - 1

        nodeAreas.push({
            id: nodeId,
            containerId: parentContainerId,
            position: isRow ? 'left' : 'top',
            width: isRow ? AREA_SIZE : pWidth,
            height: isRow ? pHeight : AREA_SIZE,
            left: isRow ? left - AREA_OFFSET : pLeft,
            top: isRow ? pTop : top - AREA_OFFSET,
        })

        // 如果是最后一个元素，需要额外再生成一个区域
        if (isLast) {
            nodeAreas.push({
                id: nodeId,
                containerId: parentContainerId,
                position: isRow ? 'right' : 'bottom',
                width: isRow ? AREA_SIZE : pWidth,
                height: isRow ? pHeight : AREA_SIZE,
                left: isRow ? right - AREA_OFFSET : pLeft,
                top: isRow ? pTop : bottom - AREA_OFFSET,
            })
        }
    }
}

// 创建区域指示，用来调试的
export const createAreaIndicator = () => {
    // 使用 document fragment 一次性插入，减少重绘
    // 属于性能优化的一个点
    const documentFragment = document.createDocumentFragment()
    nodeAreas.forEach(area => {
        const { left, top, width, height } = area
        const dom = document.createElement('div')
        dom.setAttribute('data-area', 'true')
        dom.style.position = 'absolute'
        dom.style.left = `${left}px`
        dom.style.top = `${top}px`
        dom.style.width = `${width}px`
        dom.style.height = `${height}px`
        dom.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
        documentFragment.appendChild(dom)
    })
    document.body.appendChild(documentFragment)
}

export const updateAreaIndicator = (scrollTop?: number) => {
    if (!nodeAreas.length) {
        return
    }
    const areas = document.querySelectorAll<HTMLDivElement>('[data-area]')
    areas.forEach((area, index) => {
        const { left, top, width, height } = nodeAreas[index]
        area.style.left = `${left}px`
        area.style.top = `${top - (scrollTop ?? 0)}px`
        area.style.width = `${width}px`
        area.style.height = `${height}px`
    })
}

// 清除所有区域指示
export const removeAreaIndicator = () => {
    const areas = document.querySelectorAll('[data-area]')
    areas.forEach(area => {
        area.remove()
    })
    clearNodeAreas()
}

/**
 * 清除虚拟区域数据
 */
export const clearNodeAreas = () => {
    nodeAreas = []
}
