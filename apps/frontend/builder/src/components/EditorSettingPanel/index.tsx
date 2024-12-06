/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { useBlockStore } from '@/stores/useBlockStore'

import { BlocksSettings } from './BlocksSettings'
import { PageSettings } from './PageSettings'

export function EditorSettingPanel() {
    const activeBlock = useBlockStore(state => state.activeBlock)

    let content = null
    if (activeBlock) {
        content = <BlocksSettings />
    } else {
        content = <PageSettings />
    }

    return <div className="w-[300px] overflow-x-hidden border-l">{content}</div>
}
