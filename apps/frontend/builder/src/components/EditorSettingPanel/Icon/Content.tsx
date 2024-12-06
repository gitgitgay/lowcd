/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@miaoma-lowcode/shadcn/components/ui/accordion'
import { Controller, useFormContext } from 'react-hook-form'

import { PureTextInput } from '@/components/PureTextInput'

export function Content() {
    const { control } = useFormContext()
    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="px-4 border-none">
                <AccordionTrigger>内容</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center">
                        <div className="w-[60px]">Emoji</div>
                        <Controller control={control} name="props.icon" render={({ field }) => <PureTextInput {...field} />} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
