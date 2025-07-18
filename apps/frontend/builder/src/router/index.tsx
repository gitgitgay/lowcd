/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Layout } from '@/layout'
import { AppList } from '@/views/AppList'
import { CodeMirrorDemo } from '@/views/CodeMirrorDemo'
import { DataSource } from '@/views/DataSource'
import { Editor } from '@/views/Editor'
import { Resources } from '@/views/Resources'
import { Workflow } from '@/views/Workflow'

// 这里是为了解决 react-router-dom 的类型问题

type PickRouter<T> = T extends (...args: any[]) => infer R ? R : never

type A = typeof createBrowserRouter

export const router: PickRouter<A> = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <AppList />,
            },
            {
                path: 'editor/:id',
                element: <Editor />,
            },
            {
                path: 'data-source',
                element: <Navigate to="/data-source/1" replace />,
            },
            {
                path: 'data-source/:id',
                element: <DataSource />,
            },
            {
                path: 'workflow',
                element: <Workflow />,
            },
            {
                path: 'resources',
                element: <Resources />,
            },
            {
                path: 'codemirror-demo',
                element: <CodeMirrorDemo />,
            },
        ],
    },
])
