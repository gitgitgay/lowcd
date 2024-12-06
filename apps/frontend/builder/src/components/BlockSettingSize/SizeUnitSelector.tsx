/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@miaoma-lowcode/shadcn/components/ui/dropdown-menu'

interface SizeUnitSelectorProps {
    options: { label: string; value: string }[]
    value: string
    children?: React.ReactNode
    onChange: (value: string) => void
}

export function SizeUnitSelector(props: SizeUnitSelectorProps) {
    const { value, options, children, onChange } = props
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end" sideOffset={10} alignOffset={-10}>
                <DropdownMenuRadioGroup value={value}>
                    {options.map(option => (
                        <DropdownMenuRadioItem key={option.value} value={option.value} onClick={() => onChange(option.value)}>
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
