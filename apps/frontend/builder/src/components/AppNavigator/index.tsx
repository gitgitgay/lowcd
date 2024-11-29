/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Avatar, AvatarFallback, AvatarImage } from '@miaoma-lowcode/shadcn/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@miaoma-lowcode/shadcn/components/ui/dropdown-menu'
import { cn } from '@miaoma-lowcode/shadcn/lib/utils'
import { LogOut, Logs, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
    {
        title: '应用',
        url: '/',
    },
    {
        title: '数据源',
        url: '/data-source',
    },
    {
        title: '工作流',
        url: '/workflow',
    },
    {
        title: '资源中心',
        url: '/resources',
    },
]

const avatarUrl = `https://robohash.org/heyi?set=set1&size=100x100`

export function AppNavigator() {
    return (
        <div className="flex flex-row items-center gap-4 h-[50px] px-4 bg-zinc-950">
            <div className="flex flex-row items-center h-full text-muted-foreground">
                <img src="/logo.png" alt="logo" className="w-[30px] h-[30px] inline-block mr-[10px]" />
                <div className="font-bold text-zinc-200">妙码低代码</div>
            </div>
            <div className="flex flex-row flex-1 items-center gap-2 text-muted-foreground font-bold">
                {links.map(link => (
                    <NavLink
                        to={link.url}
                        className={({ isActive }) => cn('rounded-full mx-1 px-4 py-1 text-[13px]', isActive && 'text-muted bg-zinc-800')}
                    >
                        {link.title}
                    </NavLink>
                ))}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="size-7">
                        <AvatarImage src={avatarUrl} alt="heyi" />
                        <AvatarFallback>Heyi</AvatarFallback>
                    </Avatar>
                    {/* <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" /> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="size-7">
                                <AvatarImage src={avatarUrl} alt="heyi" />
                                <AvatarFallback>Heyi</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">合一</span>
                                <span className="truncate text-xs">heyi@miaomaedu.com</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Settings />
                            设置
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <Logs />
                            审计日志
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogOut />
                        退出
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
