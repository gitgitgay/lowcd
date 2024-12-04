/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { BlockProtocol } from './block'
import { LayoutProtocol } from './layout'

export interface PageProtocol {
    id: string
    title: string
    type: 'page'
    props: {
        layout: LayoutProtocol
    }
    children: BlockProtocol[]
}
