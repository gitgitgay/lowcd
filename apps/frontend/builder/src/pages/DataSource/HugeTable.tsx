/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import '@glideapps/glide-data-grid/dist/index.css'

import { DataEditor, GridCell, GridCellKind } from '@glideapps/glide-data-grid'
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { ArrowUp, Database } from 'lucide-react'

import { useDatabaseStore } from '@/stores/useDatabaseStore'

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
    const database = useDatabaseStore(state => state.databases[id])
    const updateDatabase = useDatabaseStore(state => state.updateDatabase)
    const { columns = [], records = {}, rows = [] } = database ?? {}

    const recordRows = rows.map(row => records[row])

    const handleAdd = (data: { name: string; type: string }) => {
        const newColumns = [...columns, { id: `${data.type}-${data.name}`, title: data.name, width: 100, hasMenu: true, type: data.type }]
        // 为每一行添加新列的默认值
        const newRecords = { ...records }
        rows.forEach(row => {
            newRecords[row] = [...newRecords[row], '']
        })
        /**
         * 更新行列
         */
        updateDatabase(id, {
            ...database,
            columns: newColumns,
            records: newRecords,
        })
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
                rows={rows.length}
                rightElement={<ColumnAdder onAdd={handleAdd} />}
                getCellContent={([col, row]) => {
                    return {
                        kind: columns[col].type,
                        allowOverlay: true,
                        data: recordRows[row][col],
                        displayData: recordRows[row][col],
                    } as GridCell
                }}
                // onColumnMoved={(from, to) => {
                //     const newCols = [...columns]
                //     const [moved] = newCols.splice(from, 1)
                //     newCols.splice(to, 0, moved)
                //     setColumns(newCols)
                // }}
                // onColumnResize={(_, newSize, colIndex) => {
                //     const newCols = [...columns]
                //     newCols[colIndex].width = newSize
                //     setColumns(newCols)
                // }}
                onCellEdited={([col, row], newVal) => {
                    const record = recordRows[row]
                    if (newVal.kind === GridCellKind.Number) {
                        record[col] = `${newVal.data}` || ''
                    } else {
                        record[col] = newVal.data
                    }
                    updateDatabase(id, {
                        ...database,
                        records: {
                            ...records,
                            [rows[row]]: record,
                        },
                    })
                }}
                onRowAppended={() => {
                    updateDatabase(id, {
                        ...database,
                        rows: [...rows, `${rows.length}`],
                        records: {
                            ...records,
                            [`${rows.length}`]: dummyCellData,
                        },
                    })
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
