/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { EditorCanvas } from '@/components/EditorCanvas'
import { EditorLeftPanel } from '@/components/EditorLeftPanel'
import { EditorNavigator } from '@/components/EditorNavigator'
import { EditorSettingPanel } from '@/components/EditorSettingPanel'

export function Editor() {
    return (
        <div className="h-full">
            <EditorNavigator />
            <div className="flex flex-row h-[calc(100%-46px)]">
                <EditorLeftPanel />
                <EditorCanvas />
                <EditorSettingPanel />
            </div>
        </div>
    )
}
