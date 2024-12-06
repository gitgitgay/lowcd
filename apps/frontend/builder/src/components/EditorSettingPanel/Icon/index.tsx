/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Separator } from '@miaoma-lowcode/shadcn/components/ui/separator'

import { BlockSettingSize } from '@/components/BlockSettingSize'

import { Content } from './Content'

export function IconSetting() {
    return (
        <>
            <Content />
            <Separator className="my-1" />
            <BlockSettingSize />
        </>
    )
}
