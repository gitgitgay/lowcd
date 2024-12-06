/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

export type AreaType = {
    id: string
    containerId: string
    position: 'left' | 'right' | 'top' | 'bottom'
    width: number
    height: number
    left: number
    // right: number;
    top: number
    // bottom: number;
    subAreas?: AreaType[]
}

let isDragging = false

let dragId = ''

// engine
let currentOverlay: HTMLDivElement | null = null

let start = { x: 0, y: 0, top: 0, left: 0 }
let delta = { x: 0, y: 0 }

let indicator: HTMLElement | null

let insertPayload: {
    nodeId: string
    parentId: string
    position?: AreaType['position']
} | null = null

let nodeAreas: AreaType[] = []

const areaSize = 12
const areaOffset = areaSize / 2

const generateAreas = () => {
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

        if (!containerId || !nodeId || !parentContainer || !parentContainerId || nodeId === dragId) {
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
            width: isRow ? areaSize : pWidth,
            height: isRow ? pHeight : areaSize,
            left: isRow ? left - areaOffset : pLeft,
            top: isRow ? pTop : top - areaOffset,
        })

        // 如果是最后一个元素，需要额外再生成一个区域
        if (isLast) {
            nodeAreas.push({
                id: nodeId,
                containerId: parentContainerId,
                position: isRow ? 'right' : 'bottom',
                width: isRow ? areaSize : pWidth,
                height: isRow ? pHeight : areaSize,
                left: isRow ? right - areaOffset : pLeft,
                top: isRow ? pTop : bottom - areaOffset,
            })
        }
    }
}

// 创建区域指示，用来调试的
// const createAreaIndicator = () => {
//   nodeAreas.forEach((area) => {
//     const { left, top, width, height } = area;
//     const dom = document.createElement("div");
//     dom.setAttribute("data-area", "true");
//     dom.style.position = "absolute";
//     dom.style.left = `${left}px`;
//     dom.style.top = `${top}px`;
//     dom.style.width = `${width}px`;
//     dom.style.height = `${height}px`;
//     dom.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
//     document.body.appendChild(dom);
//   });
// };

const createIndicator = (hoveredArea: AreaType) => {
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
    indicator.style.top = `${top}px`
    indicator.style.width = `${width}px`
    indicator.style.height = `${height}px`
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 1)'
}

export const init = () => {
    const mouseDownHandler = (event: MouseEvent) => {
        if (event.button !== 0) {
            return
        }
        event.stopPropagation()
        document.body.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'
        const dom = event.target as HTMLElement
        isDragging = true
        dragId = dom.getAttribute('data-node') as string

        generateAreas()

        // eslint-disable-next-line no-console
        console.log('🚀 ~ mouseDownHandler ~ dragId:', nodeAreas)

        // 创建区域指示
        // createAreaIndicator();

        /**
         * start = { x: event.clientX, y: event.clientY }
         */
        const domRect = dom?.getBoundingClientRect()

        if (domRect) {
            start = {
                x: event.clientX,
                y: event.clientY,
                top: domRect.top,
                left: domRect.left,
            }
        }

        const overlay = dom?.cloneNode(true) as HTMLDivElement
        overlay.removeAttribute('data-node')
        overlay.style.pointerEvents = 'none'
        overlay.style.position = 'absolute'
        overlay.style.width = `${domRect?.width + 15}px`
        overlay.style.maxHeight = '200px'
        // overlay.style.left = `${start.left}px`;
        // overlay.style.top = `${start.top}px`;
        overlay.style.left = `${start.x + 8}px`
        overlay.style.top = `${start.y + 12}px`
        overlay.style.borderRadius = '6px'
        overlay.style.border = '1px solid rgba(0, 0, 0, 0.1)'
        // overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
        overlay.style.padding = '6px'
        document.body.appendChild(overlay)

        currentOverlay = overlay
    }
    const mouseMoveHandler = (event: MouseEvent) => {
        if (isDragging && currentOverlay) {
            // console.log("🚀 ~ mouseMoveHandler ~ event:", event);
            // 清除之前的颜色
            const prevHovered = document.querySelector('[data-hover]') as HTMLElement
            // console.log("🚀 ~ mouseMoveHandler ~ prevHovered:", prevHovered);
            if (prevHovered) {
                prevHovered.removeAttribute('data-hover')
                prevHovered.style.backgroundColor = ''
            }
            // delta = {
            //   x: event.clientX - start.x,
            //   y: event.clientY - start.y,
            // };
            delta = {
                x: event.clientX - start.x,
                y: event.clientY - start.y,
            }
            const { x: deltaX, y: deltaY } = delta
            currentOverlay.style.transform = `translate(${deltaX}px, ${deltaY}px)`

            /**
             * 检测
             */
            // 通过和 nodeAreas 进行比对，判断当前鼠标位置是否在某个区域内
            const hovered = nodeAreas.find(area => {
                const { left, top, width, height } = area
                return event.clientX >= left && event.clientX <= left + width && event.clientY >= top && event.clientY <= top + height
            })

            if (hovered) {
                insertPayload = {
                    nodeId: hovered.id,
                    parentId: hovered.containerId,
                    position: hovered.position,
                }
                createIndicator(hovered)
            } else {
                // eslint-disable-next-line no-console
                console.log('🚀 ~ mouseMoveHandler ~ insertPayload:', hovered)
                insertPayload = null
                indicator?.remove()
            }
        }
    }
    const mouseUpHandler = () => {
        if (!isDragging) {
            return
        }
        document.body.style.cursor = ''
        isDragging = false
        // eslint-disable-next-line no-console
        console.log('🚀 ~ mouseUpHandler ~ dragId:', dragId)
        // eslint-disable-next-line no-console
        console.log('🚀 ~ mouseUpHandler ~ insertPayload:', insertPayload)
        dragId = ''
        insertPayload = null

        nodeAreas = []

        currentOverlay?.remove()
        indicator?.remove()
        // 删除所有区域指示
        const areas = document.querySelectorAll('[data-area]')
        areas.forEach(area => {
            area.remove()
        })
        // 清除
        const prevHovered = document.querySelector('[data-hover]') as HTMLElement
        if (prevHovered) {
            prevHovered.removeAttribute('data-hover')
            prevHovered.style.backgroundColor = ''
        }
    }

    // nodes
    const nodes = document.querySelectorAll('[data-node]')
    // console.log("🚀 ~ nodes:", nodes);
    // 为每个节点添加拖拽事件
    nodes.forEach(node => {
        ;(node as HTMLDivElement).addEventListener('mousedown', mouseDownHandler, false)
    })
    // ref.current?.addEventListener("mousedown", mouseDownHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false)
    document.addEventListener('mouseup', mouseUpHandler, false)

    return () => {
        nodes.forEach(node => {
            ;(node as HTMLDivElement).removeEventListener('mousedown', mouseDownHandler, false)
        })
        document.removeEventListener('mousemove', mouseMoveHandler, false)
        document.removeEventListener('mouseup', mouseUpHandler, false)
    }
}
