/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { createBrowserRouter } from 'react-router-dom'

import { Editor } from '@/views/Editor'

// 这里是为了解决 react-router-dom 的类型问题

type PickRouter<T> = T extends (...args: any[]) => infer R ? R : never

type A = typeof createBrowserRouter

export const router: PickRouter<A> = createBrowserRouter([
    {
        path: '/',
        element: <Editor />,
    },
])
