/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Separator } from '@miaoma-lowcode/shadcn/components/ui/separator'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { BlockProtocol } from '@/protocols/block'
import { useBlockStore } from '@/stores/useBlockStore'

import { ButtonSetting } from './Button'
import { ContainerSetting } from './Container'
import { DividerSetting } from './Divider'
import { IconSetting } from './Icon'
import { ImageSetting } from './Image'
import { TextSetting } from './Text'

export function BlocksSettings() {
    const activeBlock = useBlockStore(state => state.activeBlock)

    const updateBlock = useBlockStore(state => state.updateBlock)
    const methods = useForm({
        values: {
            ...activeBlock,
        },
    })

    useEffect(() => {
        methods.watch(values => {
            updateBlock(values as BlockProtocol)
        })
    }, [methods, updateBlock])

    let settingContent = null

    switch (activeBlock?.type) {
        case 'container':
            settingContent = <ContainerSetting />
            break
        case 'button':
            settingContent = <ButtonSetting />
            break
        case 'text':
            settingContent = <TextSetting />
            break
        case 'image':
            settingContent = <ImageSetting />
            break
        case 'icon':
            settingContent = <IconSetting />
            break
        case 'divider':
            settingContent = <DividerSetting />
            break
        default:
            settingContent = null
    }

    return (
        <FormProvider {...methods}>
            <div className="px-4 py-3 text-sm font-semibold">{activeBlock?.title}</div>
            <Separator />
            {settingContent}
        </FormProvider>
    )
}
