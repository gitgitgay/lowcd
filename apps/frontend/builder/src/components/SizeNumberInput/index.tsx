/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { cn } from '@miaoma-lowcode/shadcn/lib/utils'
import React, { useEffect, useState } from 'react'

export type SizeValue = number | 'auto'

interface SizeNumberInputProps {
    className?: string
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    value?: SizeValue
    onChange: (value: SizeValue) => void
}

export const SizeNumberInput: React.FC<SizeNumberInputProps> = ({ className, prefix, suffix, value, onChange }) => {
    const [v, setV] = useState(value)

    useEffect(() => {
        setV(value)
    }, [value])

    return (
        <div className={cn(className, 'flex flex-row items-center h-8 rounded-md overflow-hidden bg-zinc-100')}>
            {prefix && <div className="ml-2 text-zinc-500">{prefix}</div>}
            <input
                className="w-full mx-1 bg-transparent outline-none"
                type="number"
                value={v}
                onChange={ev => setV(ev.target.value as SizeValue)}
                onBlur={ev => onChange(Number(ev.target.value as SizeValue))}
            />
            {suffix && <div className="mr-2 text-zinc-500">{suffix}</div>}
        </div>
    )
}
