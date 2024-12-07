/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Button } from '@miaoma-lowcode/shadcn/components/ui/button'
import { Input } from '@miaoma-lowcode/shadcn/components/ui/input'
import { Label } from '@miaoma-lowcode/shadcn/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@miaoma-lowcode/shadcn/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@miaoma-lowcode/shadcn/components/ui/select'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface ColumnAdderProps {
    onAdd: (data: { name: string; type: string }) => void
}

const COLUMN_TYPES = [
    {
        label: '文本',
        value: 'text',
    },
    {
        label: '数字',
        value: 'number',
    },
    {
        label: '布尔值',
        value: 'boolean',
    },
    {
        label: '链接',
        value: 'uri',
    },
    {
        label: '图片',
        value: 'image',
    },
    {
        label: '数组',
        value: 'bubble',
    },
    {
        label: '富文本',
        value: 'markdown',
    },
]

export function ColumnAdder(props: ColumnAdderProps) {
    const { onAdd } = props
    const [open, setOpen] = useState(false)
    const { register, control, reset, handleSubmit } = useForm<{ name: string; type: string }>()

    const handleAdd = () => {
        handleSubmit(data => {
            onAdd(data)
            setOpen(false)
            reset({ name: '', type: undefined })
        })()
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="flex flex-col justify-between items-center w-[120px] h-full border-l bg-zinc-50 hover:bg-zinc-100 cursor-pointer">
                    <div className="flex justify-center items-center w-full h-[37px] text-zinc-500">
                        <Plus size={20} />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="right" align="start">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">创建列</h4>
                        <p className="text-sm text-muted-foreground">请选择列类型与配置列名称</p>
                    </div>
                    <div className="grid gap-2 my-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">名称</Label>
                            <Input id="width" className="col-span-2 h-8" {...register('name', { required: true })} />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">类型</Label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="col-span-2 h-8">
                                            <SelectValue placeholder="请选择列类型" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COLUMN_TYPES.map(item => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" className="w-fit" onClick={() => setOpen(false)}>
                            取消
                        </Button>
                        <Button size="sm" className="w-fit" onClick={handleAdd}>
                            保存
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
