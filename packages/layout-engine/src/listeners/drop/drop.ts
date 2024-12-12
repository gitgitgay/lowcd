/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { dragItem } from '../../core/drag-item'
import { DropPayload } from '../../types/core'

export const drop = (event: any, dropCallback: (dragId: string, payload: DropPayload) => void) => {
    const target = event.target as HTMLElement
    target.classList.remove('shadow-inner')
    target.classList.remove('bg-zinc-100')
    const containerId = target.getAttribute('data-container')

    if (!containerId) {
        return
    }
    dropCallback(dragItem.dragId, { parentId: containerId })
}
