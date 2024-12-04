/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { cn } from '@miaoma-lowcode/shadcn/lib/utils'
import { PlusCircle, TableOfContents, Variable } from 'lucide-react'
import { useState } from 'react'

import { ComponentPanel } from './ComponentPanel'
import { LayerPanel } from './LayerPanel'

type EditorLeftPanelMenuType = 'components' | 'layer' | 'state'

const menus: { menu: EditorLeftPanelMenuType; icon: React.ReactNode }[] = [
    {
        menu: 'components',
        icon: <PlusCircle size={20} />,
    },
    {
        menu: 'layer',
        icon: <TableOfContents size={20} />,
    },
    {
        menu: 'state',
        icon: <Variable size={20} />,
    },
]

export function EditorLeftPanel() {
    const [activeMenu, setActiveMenu] = useState<EditorLeftPanelMenuType | null>('components')

    const handleMenuItemClick = (menu: EditorLeftPanelMenuType) => {
        if (menu === activeMenu) {
            setActiveMenu(null)
            return
        }
        setActiveMenu(menu)
    }

    return (
        <div className="flex flex-row border-r select-none">
            <div className="flex flex-col flex-shrink-0 items-center gap-4 w-[50px] h-full py-4">
                {menus.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            'flex items-center justify-center size-9 rounded-md text-zinc-400 hover:text-foreground cursor-pointer',
                            activeMenu === item.menu && 'text-foreground bg-zinc-100'
                        )}
                        onClick={() => handleMenuItemClick(item.menu)}
                    >
                        {item.icon}
                    </div>
                ))}
            </div>
            {activeMenu && (
                <div className="w-[278px] bg-zinc-50 border-l">
                    {activeMenu === 'components' && <ComponentPanel />}
                    {activeMenu === 'layer' && <LayerPanel />}
                </div>
            )}
        </div>
    )
}
