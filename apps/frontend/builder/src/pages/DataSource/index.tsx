/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import '@glideapps/glide-data-grid/dist/index.css'

import { DataEditor, GridCell, GridCellKind, GridColumn, Item } from '@glideapps/glide-data-grid'
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { cn } from '@miaoma-lowcode/shadcn/lib/utils'
import { ArrowUp, Database, Plus, Sheet } from 'lucide-react'
import React from 'react'
import { NavLink, useMatch } from 'react-router-dom'

import { AppNavigator } from '@/components/AppNavigator'

const data = [
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
    {
        name: 'John',
        age: 18,
    },
    {
        name: 'Maria',
        age: 21,
    },
    {
        name: 'Nancy',
        age: 22,
    },
    {
        name: 'James',
        age: 25,
    },
]

// Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
const columns: GridColumn[] = [
    { title: '姓名', width: 100 },
    { title: '年龄', width: 100 },
]

// If fetching data is slow you can use the DataEditor ref to send updates for cells
// once data is loaded.
function getData([col, row]: Item): GridCell {
    const person = data[row]

    if (col === 0) {
        return {
            kind: GridCellKind.Text,
            data: person.name,
            allowOverlay: false,
            displayData: person.name,
        }
    } else if (col === 1) {
        return {
            kind: GridCellKind.Number,
            data: person.age,
            allowOverlay: false,
            displayData: `${person.age}`,
        }
    } else {
        throw new Error()
    }
}

const databases = [
    { id: '1', name: '用户表' },
    { id: '2', name: '商品表' },
]

export function DataSource() {
    const match = useMatch('/data-source/:id')
    return (
        <div /*  className="bg-[#F7F7F8]" */>
            <AppNavigator />
            <div className="w-full">
                {/* <div className="h-[60px]">
                    <div className="p-4 text-lg font-bold">数据源</div>
                </div> */}
                <div className="flex flex-row">
                    <div className="w-[260px] p-4 gap-2 border-r-[1px]">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <h2 className="text-sm font-bold">数据源列表</h2>
                            <Button size="icon" className="size-6" variant="ghost">
                                <Plus size={18} />
                            </Button>
                        </div>
                        <NavLink
                            to="/data-source/1"
                            className={({ isActive }) =>
                                cn('flex flex-row items-center h-[36px] p-2 rounded-md text-sm', isActive && 'bg-zinc-100')
                            }
                        >
                            <Sheet size={16} className="mr-2" />
                            用户表
                        </NavLink>
                        <NavLink
                            to="/data-source/2"
                            className={({ isActive }) =>
                                cn('flex flex-row items-center h-[36px] p-2 rounded-md text-sm', isActive && 'bg-zinc-100')
                            }
                        >
                            <Sheet size={16} className="mr-2" />
                            商品表
                        </NavLink>
                    </div>
                    <div className="flex flex-col flex-1 h-[calc(100vh-50px)]">
                        <div className="flex flex-row items-center h-[80px] border-b bg-zinc-100">
                            <Database size={16} className="ml-4" />
                            <div className="text-lg font-bold ml-2">{databases.find(({ id }) => match?.params?.id === id)?.name}</div>
                        </div>
                        <DataEditor
                            width="100%"
                            // height="calc(100vh - 100px)"
                            rowMarkers="both"
                            columns={columns}
                            getCellContent={getData}
                            rows={data.length}
                        />
                        <div className="flex-1 px-6 pt-4 pb-2 bg-zinc-100">
                            <Button size="sm" variant="ghost" className="hover:bg-gray-200 text-zinc-500">
                                <ArrowUp size={16} />
                                导入
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
