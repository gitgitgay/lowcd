/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@miaoma-lowcode/shadcn/components/ui/card'
import { Separator } from '@miaoma-lowcode/shadcn/components/ui/separator'
import { Skeleton } from '@miaoma-lowcode/shadcn/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { AppNavigator } from '@/components/AppNavigator'

const apps = [
    {
        id: 'af7b6b54-6b3b-4b1b-8b3b-7f3b6b3b6b3b',
        title: '员工后台',
        icon: '📄',
    },
    {
        id: 'fa7b6b54-6b3b-4b1b-8b3b-7f3b6b3b6gh2',
        title: '电商平台',
        icon: '📊',
    },
    {
        id: 'af7b6b54-6b3b-4b1b-8b3b-7f3b6b3b6bb4',
        title: '妙码 CRM',
        icon: '🎨',
    },
    {
        id: 'aw7b6b54-6b3b-4b1b-8b3b-7f3b6b3b6bb5',
        title: '妙码双十一活动落地页',
        icon: '📝',
    },
    {
        id: 'vf7b6b54-6b3b-4b1b-8b3b-7f3b6b3b6bb6',
        title: '妙码双十二活动',
        icon: '📝',
    },
]

export function AppList() {
    return (
        <div className="relative">
            <div className="sticky top-0">
                <AppNavigator />
            </div>
            <div className="flex flex-col w-[80%] h-full mx-auto">
                <div className="flex flex-row justify-between p-6">
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-xl font-bold">晚上好，合一</h1>
                    </div>
                    <Button size="sm">
                        <Plus size={16} />
                        新建应用
                    </Button>
                </div>
                <div className="flex flex-row flex-wrap gap-6 px-6">
                    {apps?.map((app, index) => (
                        <NavLink to={`editor/${app.id}`}>
                            <Card className="w-[20%] min-w-[300px] flex-shrink-0 shadow-md hover:shadow-xl cursor-pointer shadow-zinc-100 border-zinc-100">
                                <CardHeader>
                                    <div className="flex flex-row items-center gap-2 font-bold">
                                        <div className="text-2xl">{app.icon}</div>
                                        <div>{app.title}</div>
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[200px]">
                                    {index % 2 === 0 ? (
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-[60%]" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col space-y-3">
                                            <Skeleton className="h-[125px] w-full rounded-xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-[80%]" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <Separator className="bg-zinc-100" />
                                <CardFooter className="flex flex-1 flex-col items-start gap-2 pt-4">
                                    <div className="flex flex-row w-full justify-between text-xs">
                                        <div>最后更新人：</div>
                                        <div>合一</div>
                                    </div>
                                    <div className="flex flex-row w-full justify-between text-xs">
                                        <div>最后更新时间：</div>
                                        <div>2024-10-10 12:00</div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    )
}
