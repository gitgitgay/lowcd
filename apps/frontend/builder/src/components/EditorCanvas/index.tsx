/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { ScrollArea } from '@miaoma-lowcode/shadcn/components/ui/scroll-area'
import { Sun } from 'lucide-react'
import { useEffect } from 'react'

import { ContainerProvider } from '@/contexts/container'
import { init } from '@/layout-engine'
import { BlockTreeNode, useBlockStore } from '@/stores/useBlockStore'

// import { PageProtocol } from '@/protocols/page'
import { BlockRenderer } from '../BlockRenderer'

// const pageData: PageProtocol = {
//     id: 'page-xfg1ge',
//     title: '页面',
//     type: 'page',
//     props: {
//         layout: {
//             flexDirection: 'column',
//             justifyContent: 'flex-start',
//             alignItems: 'flex-start',
//         },
//     },
// }

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

export function EditorCanvas() {
    const blockTree = useBlockStore(state => state.blockTree)
    // console.log('🚀 ~ EditorCanvas ~ blocks:', blocksState)
    const renderLayout = (layout: BlockTreeNode[]) => {
        return (
            <ContainerProvider containerId="root">
                {layout?.map((child, index) => {
                    return <BlockRenderer key={child.id} node={child} index={index} />
                })}
            </ContainerProvider>
        )
    }

    useEffect(() => {
        let destroy = null
        requestAnimationFrame(() => {
            destroy = init()
        })

        return () => {
            destroy?.()
        }
    }, [])

    return (
        <div className="flex-1 bg-zinc-100">
            <div
                className="editor-canvas-simulator-outer relative h-[calc(100%-16px)] mx-[3%] my-2 rounded-xl bg-white overflow-hidden"
                style={{
                    boxShadow:
                        'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(62, 65, 86, 0.376) 0px 0px 1px 0px, rgba(62, 65, 86, 0.15) 0px 12px 24px 0px, rgba(62, 65, 86, 0.1) 0px 20px 40px 0px',
                }}
            >
                <div className="editor-canvas-simulator">
                    <div className="flex flex-row items-center gap-2 h-10 px-4 bg-zinc-100">
                        <div className="size-3 rounded-full bg-red-500"></div>
                        <div className="size-3 rounded-full bg-yellow-500"></div>
                        <div className="size-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <ScrollArea className="page-content w-full h-full overflow-y-auto">
                    <div className="w-full h-full page-content-inner max-w-[1024px] m-auto">{renderLayout(blockTree)}</div>
                </ScrollArea>
                <div className="flex items-center absolute bottom-4 right-4 px-2 py-1 text-xs rounded-md bg-primary text-primary-foreground">
                    <Sun size={16} className="mr-1 animate-spin" />
                    妙码 搭建
                </div>
            </div>
        </div>
    )
}
