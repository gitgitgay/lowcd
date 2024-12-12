/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import interact from 'interactjs'

import { adjustScroll } from '../core/scroll'
import { dragEnd } from '../listeners/drag/drag-end'
import { dragMove } from '../listeners/drag/drag-move'
import { dragStart } from '../listeners/drag/drag-start'
import { dragEnter } from '../listeners/drop/drag-enter'
import { dragLeave } from '../listeners/drop/drag-leave'
import { drop } from '../listeners/drop/drop'
import { LayoutEngineOptions } from '../types/core'

export const init = (params: LayoutEngineOptions) => {
    interact('[data-node]').draggable({
        autoScroll: {
            container: document.querySelector('.page-content') as HTMLElement,
            enabled: true,
        },
        listeners: {
            start: dragStart,
            move: dragMove,
            end: () => dragEnd(params.onInsert),
        },
    })

    /**
     * 处理滚动条逻辑
     */
    adjustScroll()

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
            dragenter: dragEnter,
            dragleave: dragLeave,
            drop: event => drop(event, params.onDrop),
        },
    })
}
