/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import '@glideapps/glide-data-grid/dist/index.css'

import { DataEditor, GridCell, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { ArrowUp, Database } from 'lucide-react'
import { useState } from 'react'

import { ColumnAdder } from './ColumnAdder'

interface HugeTableProps {
    id: string
    title: string
}

// Uri = "uri",
// Text = "text",
// Image = "image",
// RowID = "row-id",
// Number = "number",
// Bubble = "bubble",
// Boolean = "boolean",
// Loading = "loading",
// Markdown = "markdown",
// Protected = "protected",
// Custom = "custom",

const dummyCellData = [
    'Edit',
    '女',
    `2`,
    true,
    'https://www.miaomaedu.com',
    ['https://docs.pmnd.rs/_next/static/media/zustand-icon.3261dd51.svg'],
    ['篮球', '跳舞'],
    '## 详情\n这是一个详情',
]

export function HugeTable(props: HugeTableProps) {
    const { id, title } = props
    const [columns, setColumns] = useState([
        {
            title: '姓名',
            width: 200,
            hasMenu: true,
            type: 'text',
        },
        {
            title: '性别',
            width: 200,
            hasMenu: true,
            type: 'text',
        },
        {
            title: '年龄',
            width: 80,
            hasMenu: true,
            type: 'number',
        },
        {
            title: '婚姻状况',
            width: 80,
            hasMenu: true,
            type: 'boolean',
        },
        {
            title: '个人主页',
            width: 200,
            hasMenu: true,
            type: 'uri',
        },
        {
            title: '头像',
            width: 80,
            type: 'image',
        },
        {
            title: '爱好',
            width: 150,
            hasMenu: true,
            type: 'bubble',
        },
        {
            title: '详情',
            width: 200,
            type: 'markdown',
        },
    ])
    const [vals, setVals] = useState(() => {
        const result = []
        for (let i = 0; i < 100; i++) {
            result.push([
                'Edit',
                i % 3 === 0 ? '男' : '女',
                `${i}`,
                i % 2 === 0 ? true : false,
                'https://www.miaomaedu.com',
                ['https://docs.pmnd.rs/_next/static/media/zustand-icon.3261dd51.svg'],
                ['篮球', '跳舞'],
                '## 详情\n这是一个详情',
            ])
        }
        return result
    })

    const handleAdd = (data: { name: string; type: string }) => {
        setColumns([...columns, { title: data.name, width: 100, hasMenu: true, type: data.type }])
        const newVals = vals.map(row => {
            return [...row, '']
        })
        setVals(newVals)
    }

    return (
        <div className="flex flex-col flex-1 h-[calc(100vh-50px)]">
            <div className="flex-shrink-0 flex flex-row items-center h-[60px] border-b bg-zinc-100">
                <Database size={16} className="ml-4" />
                <div className="text-lg font-bold ml-2">{title}</div>
            </div>
            <DataEditor
                key={id}
                width="100%"
                rowMarkers="both"
                theme={{
                    // textDark: '#7D5DFF',
                    // baseFontStyle: '600 13px',
                    bgIconHeader: '#7D5DFF',
                    accentColor: '#7D5DFF',
                    accentLight: '#7D5DFF20',
                    fgIconHeader: '#FFFFFF',
                }}
                trailingRowOptions={{
                    // How to get the trailing row to look right
                    sticky: true,
                    tint: true,
                    hint: '点击添加新行',
                }}
                columns={columns}
                rows={vals.length}
                rightElement={<ColumnAdder onAdd={handleAdd} />}
                getCellContent={([col, row]) =>
                    ({
                        kind: columns[col].type,
                        allowOverlay: true,
                        data: vals[row][col],
                        displayData: vals[row][col],
                    }) as GridCell
                }
                onColumnResize={(_, newSize, colIndex) => {
                    const newCols = [...columns]
                    newCols[colIndex].width = newSize
                    setColumns(newCols)
                }}
                onCellEdited={([col, row], newVal) => {
                    const newVals = [...vals]
                    const newRow = [...newVals[row]]
                    if (newVal.kind === GridCellKind.Number) {
                        newRow[col] = `${newVal.data}` || ''
                    } else {
                        // @ts-expect-error row data is not a number
                        newRow[col] = newVal.data
                    }
                    newVals[row] = newRow
                    setVals(newVals)
                }}
                onRowAppended={() => {
                    setVals([...vals, dummyCellData])
                }}
                // onHeaderMenuClick={(col, menu) => {
                //     console.log('🚀 ~ onHeaderMenuClick ~ col, menu', col, menu)
                // }}
                // onHeaderClicked={col => {
                //     console.log('🚀 ~ onHeaderClicked ~ col', col)
                // }}
            />
            <div className="flex-1 px-6 pt-4 pb-2 bg-[#F7F7F8] border-t">
                <Button size="sm" variant="ghost" className="hover:bg-gray-200 text-zinc-500">
                    <ArrowUp size={16} />
                    导入
                </Button>
            </div>
        </div>
    )
}
