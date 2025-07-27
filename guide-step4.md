# 第四步：布局引擎开发

## 1. 布局引擎核心概念

布局引擎是低代码平台的核心，负责处理拖拽、放置、位置计算等功能。

## 2. 创建布局引擎包

```bash
cd packages/layout-engine
pnpm init
pnpm add -D typescript tsup
```

## 3. 核心类型定义

创建 `packages/layout-engine/src/types/core.ts`:

```typescript
export interface DragItem {
    id: string
    type: string
    rect: DOMRect
}

export interface DropZone {
    id: string
    rect: DOMRect
    parentId: string
    position: 'left' | 'right' | 'top' | 'bottom' | 'center'
}

export interface InsertPayload {
    nodeId: string
    parentId: string
    position: 'left' | 'right' | 'top' | 'bottom'
}

export interface LayoutEngineConfig {
    onInsert?: (dragId: string, payload: InsertPayload) => void
    onDrop?: (dragId: string, payload: InsertPayload) => void
    onDragStart?: (dragId: string) => void
    onDragEnd?: (dragId: string) => void
}
```

## 4. 拖拽管理器

创建 `packages/layout-engine/src/core/drag-item.ts`:

```typescript
import { DragItem } from '../types/core'

export class DragItemManager {
    private dragItems: Map<string, DragItem> = new Map()

    register(id: string, element: HTMLElement) {
        const rect = element.getBoundingClientRect()
        this.dragItems.set(id, {
            id,
            type: element.dataset.type || '',
            rect,
        })
    }

    unregister(id: string) {
        this.dragItems.delete(id)
    }

    getDragItem(id: string): DragItem | undefined {
        return this.dragItems.get(id)
    }

    updateRect(id: string, rect: DOMRect) {
        const item = this.dragItems.get(id)
        if (item) {
            item.rect = rect
        }
    }
}
```

## 5. 放置区域管理器

创建 `packages/layout-engine/src/core/drop-zone.ts`:

```typescript
import { DropZone } from '../types/core'

export class DropZoneManager {
    private dropZones: Map<string, DropZone> = new Map()

    register(id: string, element: HTMLElement, parentId: string) {
        const rect = element.getBoundingClientRect()
        this.dropZones.set(id, {
            id,
            rect,
            parentId,
            position: 'center',
        })
    }

    unregister(id: string) {
        this.dropZones.delete(id)
    }

    getDropZone(id: string): DropZone | undefined {
        return this.dropZones.get(id)
    }

    findDropZoneAtPoint(x: number, y: number): DropZone | null {
        for (const zone of this.dropZones.values()) {
            if (this.isPointInRect(x, y, zone.rect)) {
                return zone
            }
        }
        return null
    }

    private isPointInRect(x: number, y: number, rect: DOMRect): boolean {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    }
}
```

## 6. 位置计算算法

创建 `packages/layout-engine/src/utilities/algorithms/pointerWithin.ts`:

```typescript
export function pointerWithin(rect: DOMRect, x: number, y: number): boolean {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

export function calculateDropPosition(
    dragRect: DOMRect,
    dropRect: DOMRect,
    pointerX: number,
    pointerY: number
): 'left' | 'right' | 'top' | 'bottom' | 'center' {
    const centerX = dropRect.left + dropRect.width / 2
    const centerY = dropRect.top + dropRect.height / 2

    const horizontalDistance = Math.abs(pointerX - centerX)
    const verticalDistance = Math.abs(pointerY - centerY)

    if (horizontalDistance > verticalDistance) {
        return pointerX < centerX ? 'left' : 'right'
    } else {
        return pointerY < centerY ? 'top' : 'bottom'
    }
}
```

## 7. 事件监听器

创建 `packages/layout-engine/src/listeners/drag/drag-start.ts`:

```typescript
import { DragItemManager } from '../../core/drag-item'

export function createDragStartListener(dragItemManager: DragItemManager) {
    return (event: DragEvent) => {
        const target = event.target as HTMLElement
        const dragId = target.dataset.dragId

        if (!dragId) return

        const dragItem = dragItemManager.getDragItem(dragId)
        if (!dragItem) return

        // 设置拖拽数据
        event.dataTransfer?.setData('text/plain', dragId)
        event.dataTransfer!.effectAllowed = 'move'

        // 添加拖拽样式
        target.classList.add('opacity-50')
    }
}
```

创建 `packages/layout-engine/src/listeners/drop/drop.ts`:

```typescript
import { DropZoneManager } from '../../core/drop-zone'
import { calculateDropPosition } from '../../utilities/algorithms/pointerWithin'

export function createDropListener(dropZoneManager: DropZoneManager, onDrop?: (dragId: string, payload: any) => void) {
    return (event: DragEvent) => {
        event.preventDefault()

        const dragId = event.dataTransfer?.getData('text/plain')
        if (!dragId) return

        const rect = (event.target as HTMLElement).getBoundingClientRect()
        const position = calculateDropPosition(new DOMRect(), rect, event.clientX, event.clientY)

        const dropZone = dropZoneManager.findDropZoneAtPoint(event.clientX, event.clientY)
        if (!dropZone) return

        onDrop?.(dragId, {
            nodeId: dropZone.id,
            parentId: dropZone.parentId,
            position,
        })
    }
}
```

## 8. 布局引擎主入口

创建 `packages/layout-engine/src/index.ts`:

```typescript
import { LayoutEngineConfig } from './types/core'
import { DragItemManager } from './core/drag-item'
import { DropZoneManager } from './core/drop-zone'
import { createDragStartListener } from './listeners/drag/drag-start'
import { createDropListener } from './listeners/drop/drop'

export class LayoutEngine {
    private dragItemManager: DragItemManager
    private dropZoneManager: DropZoneManager
    private config: LayoutEngineConfig

    constructor(config: LayoutEngineConfig) {
        this.config = config
        this.dragItemManager = new DragItemManager()
        this.dropZoneManager = new DropZoneManager()
    }

    init() {
        // 初始化拖拽监听器
        document.addEventListener('dragstart', createDragStartListener(this.dragItemManager))
        document.addEventListener('drop', createDropListener(this.dropZoneManager, this.config.onDrop))
        document.addEventListener('dragover', e => e.preventDefault())
    }

    registerDragItem(id: string, element: HTMLElement) {
        this.dragItemManager.register(id, element)
    }

    registerDropZone(id: string, element: HTMLElement, parentId: string) {
        this.dropZoneManager.register(id, element, parentId)
    }
}

export function init(config: LayoutEngineConfig) {
    const engine = new LayoutEngine(config)
    engine.init()
    return engine
}
```
