/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

export interface VariableEditorCoreProps {
    className?: string
    value?: string
    dataTree?: Record<string, any>
    onChange?: (value: string) => void
    onFocus?: () => void
    onBlur?: (value: string) => void
    editable?: boolean
    placeholder?: string
    readOnly?: boolean
}
