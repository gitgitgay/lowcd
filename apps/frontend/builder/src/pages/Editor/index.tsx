/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { useEffect } from 'react'

import { EditorCanvas } from '@/components/EditorCanvas'
import { EditorLeftPanel } from '@/components/EditorLeftPanel'
import { EditorNavigator } from '@/components/EditorNavigator'
import { EditorSettingPanel } from '@/components/EditorSettingPanel'
import { BlockProtocol } from '@/protocols/block'
import { useBlockStore } from '@/stores/useBlockStore'

type BlockTreeNode = Pick<BlockProtocol, 'id' | 'type'> & { children?: BlockTreeNode[] }
const blockTree: BlockTreeNode[] = [
    {
        id: 'container-xfg1ge',
        type: 'container',
        children: [
            {
                id: 'text-xfg1ge',
                type: 'text',
            },
            {
                id: 'icon-gaw1ge',
                type: 'icon',
            },
            {
                id: 'button-xfg1ge',
                type: 'button',
            },
        ],
    },
    {
        id: 'text-fga1ge',
        type: 'text',
    },
    {
        id: 'container-gaw1ge',
        type: 'container',
        children: [
            {
                id: 'text-gaw1ge',
                type: 'text',
            },
            {
                id: 'image-gaw1ge',
                type: 'image',
            },
            {
                id: 'divider-gaw1ge',
                type: 'divider',
            },
            {
                id: 'button-gaw1ge',
                type: 'button',
            },
        ],
    },
    {
        id: 'container-xag1fa',
        type: 'container',
        children: [
            {
                id: 'text-xag1fa',
                type: 'text',
            },
        ],
    },
]

const blocks: Record<string, BlockProtocol> = {
    'container-xfg1ge': {
        id: 'container-xfg1ge',
        title: '容器1',
        type: 'container',
        props: {
            layout: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            size: {
                width: 100,
                widthUnit: '%',
                height: 500,
                heightUnit: 'px',
            },
        },
    },
    'text-xfg1ge': {
        id: 'text-xfg1ge',
        title: '文本1',
        type: 'text',
        props: {
            text: '会当凌绝顶，一览众山小',
            size: {
                width: 200,
                widthUnit: 'px',
                height: 100,
                heightUnit: '%',
            },
        },
    },
    'icon-gaw1ge': {
        id: 'icon-gaw1ge',
        title: '图标1',
        type: 'icon',
        props: {
            icon: '🚀',
            size: {
                width: 'auto',
                height: 'auto',
            },
        },
    },
    'button-xfg1ge': {
        id: 'button-xfg1ge',
        title: '按钮1',
        type: 'button',
        props: {
            text: '点击我',
            size: {
                width: 'auto',
                height: 'auto',
            },
        },
    },
    'text-fga1ge': {
        id: 'text-fga1ge',
        title: '文本2',
        type: 'text',
        props: {
            text: '非常棒的，非常 Nice',
            size: {
                width: 100,
                widthUnit: '%',
                height: 100,
                heightUnit: '%',
            },
        },
    },
    'container-gaw1ge': {
        id: 'container-gaw1ge',
        title: '容器2',
        type: 'container',
        props: {
            layout: {
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            size: {
                width: 500,
                widthUnit: 'px',
                height: 300,
                heightUnit: 'px',
            },
        },
    },
    'text-gaw1ge': {
        id: 'text-gaw1ge',
        title: '文本3',
        type: 'text',
        props: {
            text: 'Hello, World!',
            size: {
                width: 100,
                widthUnit: 'px',
                height: 100,
                heightUnit: 'px',
            },
        },
    },
    'image-gaw1ge': {
        id: 'image-gaw1ge',
        title: '图片1',
        type: 'image',
        props: {
            src: 'https://docs.pmnd.rs/_next/static/media/zustand-icon.3261dd51.svg',
            size: {
                width: 150,
                widthUnit: 'px',
                height: 150,
                heightUnit: 'px',
            },
        },
    },
    'divider-gaw1ge': {
        id: 'divider-gaw1ge',
        title: '分割线1',
        type: 'divider',
        props: {
            size: {
                width: 100,
                widthUnit: '%',
                height: 1,
                heightUnit: 'px',
            },
        },
    },
    'button-gaw1ge': {
        id: 'button-gaw1ge',
        title: '按钮2',
        type: 'button',
        props: {
            text: '点击我',
            size: {
                width: 'auto',
                height: 'auto',
            },
        },
    },
    'container-xag1fa': {
        id: 'container-xag1fa',
        title: '容器',
        type: 'container',
        props: {
            layout: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            size: {
                width: 100,
                widthUnit: '%',
                height: 500,
                heightUnit: 'px',
            },
        },
    },
    'text-xag1fa': {
        id: 'text-xag1fa',
        title: '文本',
        type: 'text',
        props: {
            text: '文本',
            size: {
                width: 200,
                widthUnit: 'px',
                height: 100,
                heightUnit: '%',
            },
        },
    },
}

// const blocks: BlockProtocol[] = [
//     {
//         id: 'container-xfg1ge',
//         title: '容器1',
//         type: 'container',
//         props: {
//             layout: {
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             },
//             size: {
//                 width: 100,
//                 widthUnit: '%',
//                 height: 100,
//                 heightUnit: '%',
//             },
//         },
//         children: [
//             {
//                 id: 'text-xfg1ge',
//                 title: '文本1',
//                 type: 'text',
//                 props: {
//                     text: '会当凌绝顶，一览众山小',
//                     size: {
//                         // width: 100,
//                         // widthUnit: '%',
//                         // height: 100,
//                         // heightUnit: '%',
//                         width: 'auto',
//                         height: 200,
//                         heightUnit: 'px',
//                     },
//                 },
//             },
//             {
//                 id: 'icon-gaw1ge',
//                 title: '图标1',
//                 type: 'icon',
//                 props: {
//                     icon: '🚀',
//                 },
//             },
//             {
//                 id: 'button-xfg1ge',
//                 title: '按钮1',
//                 type: 'button',
//                 props: {
//                     text: '点击我',
//                 },
//             },
//         ],
//     },
//     {
//         id: 'text-fga1ge',
//         title: '文本2',
//         type: 'text',
//         props: {
//             text: '非常棒的，非常 Nice',
//         },
//     },
//     {
//         id: 'container-gaw1ge',
//         title: '容器2',
//         type: 'container',
//         props: {
//             layout: {
//                 flexDirection: 'column',
//                 justifyContent: 'flex-start',
//                 alignItems: 'center',
//             },
//             size: {
//                 width: 100,
//                 widthUnit: '%',
//                 height: 100,
//                 heightUnit: '%',
//             },
//         },
//         children: [
//             {
//                 id: 'text-gaw1ge',
//                 title: '文本3',
//                 type: 'text',
//                 props: {
//                     text: 'Hello, World!',
//                     size: {
//                         width: 100,
//                         widthUnit: '%',
//                         height: 100,
//                         heightUnit: '%',
//                     },
//                 },
//             },
//             {
//                 id: 'image-gaw1ge',
//                 title: '图片1',
//                 type: 'image',
//                 props: {
//                     src: 'https://via.placeholder.com/150',
//                     size: {
//                         width: 150,
//                         widthUnit: 'px',
//                         height: 150,
//                         heightUnit: 'px',
//                     },
//                 },
//             },
//             {
//                 id: 'divider-gaw1ge',
//                 title: '分割线1',
//                 type: 'divider',
//                 props: {
//                     size: {
//                         width: 100,
//                         widthUnit: '%',
//                         height: 1,
//                         heightUnit: 'px',
//                     },
//                 },
//             },
//             {
//                 id: 'button-gaw1ge',
//                 title: '按钮2',
//                 type: 'button',
//                 props: {
//                     text: '点击我',
//                 },
//             },
//         ],
//     },
// ]

export function Editor() {
    const initBlocks = useBlockStore(state => state.initBlocks)
    const initBlockTree = useBlockStore(state => state.initBlockTree)

    useEffect(() => {
        initBlockTree(blockTree)
        initBlocks(blocks)
    }, [initBlockTree, initBlocks])

    return (
        <div className="h-full">
            <EditorNavigator />
            <div className="flex flex-row h-[calc(100%-46px)]">
                <EditorLeftPanel />
                <EditorCanvas />
                <EditorSettingPanel />
            </div>
        </div>
    )
}
