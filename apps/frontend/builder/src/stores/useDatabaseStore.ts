/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { create } from 'zustand'

interface Database {
    columns: {
        title: string
        type: string
    }[]
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
}

/**
 * 选中的 block
 * @returns
 */
export const useDatabaseStore = create<DatabaseStore>(set => ({
    databases: {},
    databaseList: [],
    initDatabases: (databases: Record<string, Database>) => set({ databases }),
    initDatabaseList: (databaseList: { id: string; title: string }[]) => set({ databaseList }),
    createDatabase: (title: string) => {
        set(state => {
            const id = String(Date.now())
            const newDatabaseList = [...state.databaseList, { id, title }]
            const newDatabases = { ...state.databases, [id]: { columns: [], records: {} } }
            return { databaseList: newDatabaseList, databases: newDatabases }
        })
    },
}))
