/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import interact from 'interactjs'

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

let dragId = ''

const startScrollOffset = {
    x: 0,
    y: 0,
}

// engine
let currentOverlay: HTMLDivElement | null = null

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

const __debug__ = true

// 创建区域指示，用来调试的
const createAreaIndicator = () => {
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
const updateAreaIndicator = (scrollTop?: number) => {
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
const removeAreaIndicator = () => {
    const areas = document.querySelectorAll('[data-area]')
    areas.forEach(area => {
        area.remove()
    })
    nodeAreas = []
}

const createIndicator = (hoveredArea: AreaType, scrollTop = 0) => {
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

interface LayoutEngineParams {
    onInsert: (dragId: string, payload: typeof insertPayload) => void
    onDrop: (dragId: string, payload: { parentId: string }) => void
    onResize?: (nodeId: string, size: { width: number; height: number }) => void
}

export const init = (params: LayoutEngineParams) => {
    interact('[data-node]').draggable({
        autoScroll: {
            container: document.querySelector('.page-content') as HTMLElement,
            enabled: true,
        },
        listeners: {
            start(event) {
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
                dragId = dom.getAttribute('data-node') as string
                // const domRect = dom.getBoundingClientRect()
                // const overlay = dom.cloneNode(true) as HTMLDivElement
                // overlay.removeAttribute('data-node')
                const overlay = document.createElement('div')
                overlay.innerHTML = `
                    <p>${dragId}</p>
                    <p>${dom.textContent}</p>
                `
                overlay.style.pointerEvents = 'none'
                overlay.style.position = 'absolute'
                // overlay.style.width = '36px'
                // overlay.style.height = '36px'
                // overlay.style.width = `${domRect?.width + 15}px`
                // overlay.style.maxHeight = '200px'
                // overlay.style.left = `${start.left}px`;
                // overlay.style.top = `${start.top}px`;
                overlay.style.left = `${event.x0 + 8}px`
                overlay.style.top = `${event.y0 + 12}px`
                overlay.style.borderRadius = '6px'
                overlay.style.border = '1px solid rgba(0, 0, 0, 0.1)'
                // overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                overlay.style.backgroundColor = 'white'
                overlay.style.padding = '6px'
                document.body.appendChild(overlay)

                currentOverlay = overlay
            },
            move(event) {
                if (!currentOverlay) {
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
                currentOverlay.style.transform = `translate(${deltaX}px, ${deltaY}px)`

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
                    insertPayload = {
                        nodeId: hovered.id,
                        parentId: hovered.containerId,
                        position: hovered.position,
                    }
                    createIndicator(hovered, scrollTop)
                } else {
                    insertPayload = null
                    indicator?.remove()
                }
            },
            end() {
                if (__debug__) {
                    removeAreaIndicator()
                }
                currentOverlay?.remove()
                indicator?.remove()
                // console.log('🚀 ~ end ~ event:', event)
                // console.log('🚀 ~ end ~ insertPayload:', dragId, insertPayload)
                params.onInsert(dragId, insertPayload)
                document.body.style.cursor = ''
                dragId = ''
                insertPayload = null
            },
        },
    })

    // 更新检测区域
    const pageContent = document.querySelector('.page-content') as HTMLElement
    pageContent.onscroll = () => {
        const scrollTop = pageContent.scrollTop - startScrollOffset.y
        if (__debug__) {
            updateAreaIndicator(scrollTop)
        }
    }

    // interact('[data-node]').resizable({
    //     edges: { left: true, right: true, bottom: true, top: true },
    //     listeners: {
    //         move(event) {
    //             const target = event.target as HTMLElement
    //             let { width, height } = target.getBoundingClientRect()
    //             width = event.rect.width
    //             height = event.rect.height
    //             target.style.width = `${width}px`
    //             target.style.height = `${height}px`
    //         },
    //         end(event) {
    //             const target = event.target as HTMLElement
    //             const nodeId = target.getAttribute('data-node')
    //             const { width, height } = target.getBoundingClientRect()
    //             if (nodeId) {
    //                 params.onResize?.(nodeId, { width, height })
    //             }
    //         },
    //     },
    // })
    interact('.container-placeholder').dropzone({
        accept: '[data-node]',
        listeners: {
            dragenter(event) {
                const target = event.target as HTMLElement
                target.classList.add('shadow-inner')
                target.classList.add('bg-zinc-100')
            },
            dragleave(event) {
                const target = event.target as HTMLElement
                target.classList.remove('shadow-inner')
                target.classList.remove('bg-zinc-100')
            },
            drop(event) {
                const target = event.target as HTMLElement
                target.classList.remove('shadow-inner')
                target.classList.remove('bg-zinc-100')
                const containerId = target.getAttribute('data-container')

                if (!containerId) {
                    return
                }
                params.onDrop(dragId, { parentId: containerId })
            },
        },
    })
}
