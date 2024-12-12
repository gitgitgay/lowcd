/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { BlockProtocol } from '@/protocols/block'

export const generateDefaultBlockData = (type: string, initialBlockId?: string) => {
    const blockId = initialBlockId ?? `${type}-${Date.now()}`
    let block: BlockProtocol
    switch (type) {
        case 'container':
            block = {
                id: blockId,
                type: 'container',
                title: '容器',
                props: {
                    layout: {
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    },
                    size: {
                        width: 100,
                        widthUnit: '%',
                        height: 100,
                        heightUnit: '%',
                    },
                },
            }
            break
        case 'text':
            block = {
                id: blockId,
                type: 'text',
                title: '文本',
                props: {
                    text: '文本',
                },
            }
            break
        case 'button':
            block = {
                id: blockId,
                type: 'button',
                title: '按钮',
                props: {
                    text: '按钮',
                    size: {
                        width: 'auto',
                        height: 'auto',
                    },
                },
            }
            break
        case 'divider':
            block = {
                id: blockId,
                type: 'divider',
                title: '分割线',
                props: {
                    size: {
                        width: 100,
                        widthUnit: '%',
                        height: 1,
                        heightUnit: 'px',
                    },
                },
            }
            break
        case 'icon':
            block = {
                id: blockId,
                type: 'icon',
                title: '图标',
                props: {
                    icon: '🚀',
                },
            }
            break
        case 'image':
            block = {
                id: blockId,
                type: 'image',
                title: '图片',
                props: {
                    src: '/logo.png',
                    size: {
                        width: 100,
                        widthUnit: '%',
                        height: 'auto',
                    },
                },
            }
            break
        default:
            block = {
                id: blockId,
                type: 'text',
                title: '文本',
                props: {
                    text: '文本',
                },
            }
            break
    }
    return block
}
