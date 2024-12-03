/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { Home } from 'lucide-react'
import { NavLink } from 'react-router-dom'

/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
export function EditorNavigator() {
    return (
        <nav className="flex flex-row justify-between items-center h-[46px] pl-3 pr-4 border-b">
            <div className="flex flex-row items-center">
                <NavLink to="/">
                    <Button variant="ghost" size="icon" className="size-8">
                        <Home size={24} />
                    </Button>
                </NavLink>
                <p className="ml-3 font-bold text-sm">📝 妙码双十一活动落地页</p>
            </div>
            <div>
                <Button size="sm">分享</Button>
            </div>
        </nav>
    )
}
