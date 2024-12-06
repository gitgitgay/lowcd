/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { ArrowDownToLine, ArrowLeftToLine, ArrowRightToLine, ArrowUpToLine, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { SizeNumberInput, SizeValue } from '../SizeNumberInput'

export function PaddingSetting() {
    const { control, getValues, setValue } = useFormContext()
    const [open, setOpen] = useState(false)

    const handlePaddingChange = (index: number, value: SizeValue) => {
        const padding = getValues('props.layout.padding') || [0, 0, 0, 0]
        // 如果此时 open 为 false，那么需要为另一个值赋值
        if (!open) {
            padding[index + 2] = value
        }
        padding[index] = value
        setValue('props.layout.padding', [...padding])
    }

    return (
        <Controller
            control={control}
            name="props.layout.padding"
            render={({ field }) => (
                <div className="flex flex-col w-[180px] gap-2">
                    <div className="flex flex-row flex-wrap w-[180px] gap-2">
                        <SizeNumberInput
                            className="w-[65px]"
                            prefix={<ArrowLeftToLine size={16} />}
                            value={field.value?.[0]}
                            onChange={value => handlePaddingChange(0, value)}
                        />
                        <SizeNumberInput
                            className="w-[65px]"
                            prefix={<ArrowUpToLine size={16} />}
                            value={field.value?.[1]}
                            onChange={value => handlePaddingChange(1, value)}
                        />
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => setOpen(!open)}>
                            <ChevronsUpDown size={16} />
                        </Button>
                    </div>
                    {open && (
                        <div className="flex flex-row flex-wrap w-[180px] gap-2">
                            <SizeNumberInput
                                className="w-[65px]"
                                prefix={<ArrowRightToLine size={16} />}
                                value={field.value?.[2]}
                                onChange={value => handlePaddingChange(2, value)}
                            />
                            <SizeNumberInput
                                className="w-[65px]"
                                prefix={<ArrowDownToLine size={16} />}
                                value={field.value?.[3]}
                                onChange={value => handlePaddingChange(3, value)}
                            />
                        </div>
                    )}
                </div>
            )}
        ></Controller>
    )
}
