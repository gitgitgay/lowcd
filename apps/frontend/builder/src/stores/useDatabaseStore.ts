/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { create } from 'zustand'

interface Database {
    columns: {
        id: string
        title: string
        type: string
    }[]
    rows: string[]
    records: {
        [key: string]: any
    }
}

interface DatabaseStore {
    databases: Record<string, Database>
    databaseList: { id: string; title: string }[]
    initDatabases: (databases: Record<string, Database>) => void
    initDatabaseList: (databaseList: { id: string; title: string }[]) => void
    createDatabase: (title: string) => void
    updateDatabase: (id: string, data: Database) => void
}

const mockColumns = [
    {
        id: '1',
        title: '姓名',
        width: 200,
        hasMenu: true,
        type: 'text',
    },
    {
        id: '2',
        title: '性别',
        width: 200,
        hasMenu: true,
        type: 'text',
    },
    {
        id: '3',
        title: '年龄',
        width: 80,
        hasMenu: true,
        type: 'number',
    },
    {
        id: '4',
        title: '婚姻状况',
        width: 80,
        hasMenu: true,
        type: 'boolean',
    },
    {
        id: '5',
        title: '个人主页',
        width: 200,
        hasMenu: true,
        type: 'uri',
    },
    {
        id: '6',
        title: '头像',
        width: 80,
        type: 'image',
    },
    {
        id: '7',
        title: '爱好',
        width: 150,
        hasMenu: true,
        type: 'bubble',
    },
    {
        id: '8',
        title: '详情',
        width: 200,
        type: 'markdown',
    },
]

const mockRecords = {
    'record-1': [
        'Edit',
        '女',
        `2`,
        true,
        'https://www.miaomaedu.com',
        ['https://docs.pmnd.rs/_next/static/media/zustand-icon.3261dd51.svg'],
        ['篮球', '跳舞'],
        '## 详情\n这是一个详情',
    ],
    'record-2': [
        'Edit',
        '女',
        `2`,
        true,
        'https://www.miaomaedu.com',
        ['https://docs.pmnd.rs/_next/static/media/zustand-icon.3261dd51.svg'],
        ['篮球', '跳舞'],
        '## 详情\n这是一个详情',
    ],
    'record-3': [
        'Edit',
        '女',
        `2`,
        true,
        'https://www.miaomaedu.com',
        ['https://docs.pmnd.rs/_next/static/media/zustand-icon.3261dd51.svg'],
        ['篮球', '跳舞'],
        '## 详情\n这是一个详情',
    ],
}

/**
 * 选中的 block
 * @returns
 */
export const useDatabaseStore = create<DatabaseStore>(set => ({
    databases: {
        '1': {
            columns: mockColumns,
            rows: ['record-1', 'record-2'],
            // record pool
            records: mockRecords,
        },
        '2': {
            columns: mockColumns,
            rows: ['record-2', 'record-3'],
            // record pool
            records: mockRecords,
        },
    },
    databaseList: [],
    initDatabases: (databases: Record<string, Database>) => set({ databases }),
    initDatabaseList: (databaseList: { id: string; title: string }[]) => set({ databaseList }),
    createDatabase: (title: string) => {
        const id = String(Date.now())
        set(state => {
            const newDatabaseList = [...state.databaseList, { id, title }]
            const newDatabases = {
                ...state.databases,
                [id]: {
                    columns: mockColumns,
                    rows: ['record-1', 'record-2', 'record-3'],
                    // record pool
                    records: mockRecords,
                },
            }
            return { databaseList: newDatabaseList, databases: newDatabases }
        })

        return id
    },
    updateDatabase: (id: string, data: Database) => {
        set(state => {
            const newDatabases = {
                ...state.databases,
                [id]: data,
            }
            return { databases: newDatabases }
        })
    },
}))
