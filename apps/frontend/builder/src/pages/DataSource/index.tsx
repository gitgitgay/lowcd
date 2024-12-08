/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { cn } from '@miaoma-lowcode/shadcn/lib/utils'
import { Plus, Sheet } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'

import { AppNavigator } from '@/components/AppNavigator'
import { useDatabaseStore } from '@/stores/useDatabaseStore'

import { HugeTable } from './HugeTable'

const databases = [
    { id: '1', title: '用户表' },
    { id: '2', title: '商品表' },
]

export function DataSource() {
    const match = useMatch('/data-source/:id')
    const navigate = useNavigate()
    const initialDatabaseList = useDatabaseStore(state => state.initDatabaseList)
    const createDatabase = useDatabaseStore(state => state.createDatabase)
    const databaseList = useDatabaseStore(state => state.databaseList)
    const ds = databaseList.find(db => db.id === match?.params.id)

    const handleCreateDatabase = () => {
        const dsId = createDatabase('新建数据源')
        navigate(`/data-source/${dsId}`)
    }

    useEffect(() => {
        initialDatabaseList(databases)
    }, [initialDatabaseList])

    return (
        <div id="portal" className="h-full">
            <AppNavigator />
            <div className="w-full h-full">
                {/* <div className="h-[60px]">
                    <div className="p-4 text-lg font-bold">数据源</div>
                </div> */}
                <div className="flex flex-row h-full">
                    <div className="w-[260px] p-4 gap-2 border-r-[1px]">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <h2 className="text-sm font-bold">数据源列表</h2>
                            <Button size="icon" className="size-6" variant="ghost" onClick={handleCreateDatabase}>
                                <Plus size={18} />
                            </Button>
                        </div>
                        {databaseList.map(db => (
                            <NavLink
                                key={db.id}
                                to={`/data-source/${db.id}`}
                                className={({ isActive }) =>
                                    cn('flex flex-row items-center h-[36px] p-2 rounded-md text-sm', isActive && 'bg-zinc-100')
                                }
                            >
                                <Sheet size={16} className="mr-2" />
                                {db.title}
                            </NavLink>
                        ))}
                    </div>
                    {ds?.id && <HugeTable key={ds.id} id={ds.id} title={ds.title} />}
                </div>
            </div>
        </div>
    )
}
