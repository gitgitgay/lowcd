/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { __debug__ } from '../../__debug__'
import { dragItem, insertPayload } from '../../core/drag-item'
import { indicator } from '../../core/indicator'
import { overlay } from '../../core/overlay'
import { clearNodeAreas, removeAreaIndicator } from '../../core/virtual-area'
import { InsertPayload } from '../../types/core'

export const dragEnd = (insertCallback: (dragId: string, payload: InsertPayload) => void) => {
    if (__debug__) {
        removeAreaIndicator()
    }
    // 清除检测区域
    clearNodeAreas()
    overlay.current?.remove()
    indicator?.remove()
    // console.log('🚀 ~ end ~ event:', event)
    // console.log('🚀 ~ end ~ insertPayload:', dragId, insertPayload)
    if (insertPayload.current) {
        insertCallback(dragItem.dragId, insertPayload.current)
    }
    document.body.style.cursor = ''
    dragItem.dragId = ''
    insertPayload.current = null
}
