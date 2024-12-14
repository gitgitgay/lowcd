/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { cn } from '@miaoma-lowcode/shadcn/lib/utils'
import { intercept } from '@miaoma-lowcode/variable-editor'

import { useVariableTree } from '@/hooks/useVariableTree'
import { TextBlockProtocol } from '@/protocols/block'

export interface TextBlockProps {
    data?: TextBlockProtocol
}

export function TextBlock(props: TextBlockProps) {
    const { data } = props

    const variableTree = useVariableTree()

    const { result, error } = intercept(data?.props.text ?? '', variableTree)

    return <div className={cn(error && 'outline outline-destructive')}>{result}</div>
}
