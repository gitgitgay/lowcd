/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { Label } from '@miaoma-lowcode/shadcn/components/ui/label'
import { Switch } from '@miaoma-lowcode/shadcn/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@miaoma-lowcode/shadcn/components/ui/tabs'
import { ArrowDown, ArrowRight, ChevronRight } from 'lucide-react'
import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

enum DIRECTION {
    row = 'row',
    column = 'column',
}

type FlexAlign = 'flex-start' | 'center' | 'flex-end'

type AlignGridItemType = `${FlexAlign}:${FlexAlign}`

export const DIRECTION_OPTIONS = [
    {
        icon: <ArrowRight size={16} />,
        value: 'row',
    },
    {
        icon: <ArrowDown size={16} />,
        value: 'column',
    },
]

export const IS_DISTRIBUTED_ALIGNMENT_OPTIONS = [
    {
        label: <ChevronRight />,
        value: 'false',
    },
    {
        label: '分布对齐',
        value: 'true',
    },
]

// 生成一个 3x3 的对齐网格数组
const ALIGN_GRID: AlignGridItemType[][] = [
    ['flex-start:flex-start', 'flex-start:center', 'flex-start:flex-end'],
    ['center:flex-start', 'center:center', 'center:flex-end'],
    ['flex-end:flex-start', 'flex-end:center', 'flex-end:flex-end'],
]

const Indicator: React.FC<{ align: AlignGridItemType; direction?: DIRECTION; stretch?: boolean }> = ({ align, direction, stretch }) => {
    const [justifyContent, alignItems] = align.split(':')

    if (direction === DIRECTION.row) {
        const commonStyle = {
            width: 5,
            height: '100%',
        }
        switch (alignItems) {
            case 'flex-start':
            case 'flex-end': {
                return (
                    <div className="flex justify-between size-full" style={{ flexDirection: 'row', alignItems: alignItems }}>
                        <div className="bg-primary rounded-sm" style={{ ...commonStyle, height: stretch ? 0 : '60%' }} />
                        <div className="bg-primary rounded-sm" style={{ ...commonStyle, height: stretch ? '100%' : '90%' }} />
                        <div className="bg-primary rounded-sm" style={{ ...commonStyle, height: stretch ? 0 : '40%' }} />
                    </div>
                )
            }
            case 'center': {
                return (
                    <div className="flex justify-between size-full" style={{ flexDirection: 'row', alignItems: alignItems }}>
                        <div className="bg-primary rounded-sm" style={{ ...commonStyle, height: stretch ? 0 : '50%' }} />
                        <div className="bg-primary rounded-sm" style={commonStyle} />
                        <div className="bg-primary rounded-sm" style={{ ...commonStyle, height: stretch ? 0 : '50%' }} />
                    </div>
                )
            }
            default: {
                return null
            }
        }
    }

    const commonStyle = {
        height: 5,
        width: '100%',
    }
    switch (justifyContent) {
        case 'flex-start':
        case 'flex-end': {
            return (
                <div className="flex justify-between size-full" style={{ flexDirection: 'column', alignItems: justifyContent }}>
                    <div className="bg-primary rounded-sm" style={{ ...commonStyle, width: stretch ? 0 : '60%' }} />
                    <div className="bg-primary rounded-sm" style={{ ...commonStyle, width: stretch ? '100%' : '90%' }} />
                    <div className="bg-primary rounded-sm" style={{ ...commonStyle, width: stretch ? 0 : '40%' }} />
                </div>
            )
        }
        case 'center': {
            return (
                <div className="flex justify-between size-full" style={{ flexDirection: 'column', alignItems: justifyContent }}>
                    <div className="bg-primary rounded-sm" style={{ ...commonStyle, width: stretch ? 0 : '50%' }} />
                    <div className="bg-primary rounded-sm" style={commonStyle} />
                    <div className="bg-primary rounded-sm" style={{ ...commonStyle, width: stretch ? 0 : '50%' }} />
                </div>
            )
        }
        default: {
            return null
        }
    }
}

export const AlignmentSetting = () => {
    const { control, setValue } = useFormContext()
    const [justifyContent, alignItems, flexDirection, isDistributedAlignment] = useWatch({
        control,
        name: [
            'props.layout.justifyContent',
            'props.layout.alignItems',
            'props.layout.flexDirection',
            'props.layout.isDistributedAlignment',
        ],
    })

    const handleAlignGridItemClick = (value: AlignGridItemType) => {
        const [justifyContent, alignItems] = value.split(':')
        setValue('props.layout.justifyContent', justifyContent as FlexAlign)
        setValue('props.layout.alignItems', alignItems as FlexAlign)
    }

    return (
        <div className="flex w-[180px]">
            <div className="flex flex-col gap-3 items-stretch w-[100px] mr-[8px]">
                <Controller
                    name="props.layout.flexDirection"
                    control={control}
                    render={({ field }) => (
                        <Tabs {...field} onValueChange={field.onChange}>
                            <TabsList className="grid w-full grid-cols-2">
                                {DIRECTION_OPTIONS.map(option => (
                                    <TabsTrigger key={option.value} value={option.value}>
                                        {option.icon}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}
                />
                <Controller
                    name="props.layout.isDistributedAlignment"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-row justify-between items-center">
                            <Label className="text-xs" htmlFor="distributedAlignmentSwitch">
                                分布对齐
                            </Label>
                            <Switch id="distributedAlignmentSwitch" checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                    )}
                />
            </div>
            <div className="relative flex justify-between size-[72px] p-[6px] rounded-sm bg-zinc-100">
                {ALIGN_GRID.map(row => (
                    <div key={row[0]}>
                        {row.map(col => {
                            const [colJustifyContent, colAlignItems] = col.split(':')
                            const selected =
                                col === `${justifyContent}:${alignItems}` || isDistributedAlignment
                                    ? flexDirection === DIRECTION.column
                                        ? colJustifyContent === justifyContent
                                        : colAlignItems === alignItems
                                    : false
                            return (
                                <div
                                    className="flex flex-row justify-center items-center relative size-[20px] cursor-pointer"
                                    key={col}
                                    onClick={() => handleAlignGridItemClick(col)}
                                >
                                    {!selected && <div className="dot absolute size-[3px] rounded-full bg-zinc-400" />}
                                    {selected && <Indicator align={col} direction={flexDirection} stretch={isDistributedAlignment} />}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
