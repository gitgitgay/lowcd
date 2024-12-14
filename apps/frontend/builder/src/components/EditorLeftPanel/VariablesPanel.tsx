/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
// import ReactJsonView from 'react-json-view' 太大，舍弃// 118.1k (gzipped: 33k)
import JsonView from '@uiw/react-json-view'

import { useVariableTree } from '@/hooks/useVariableTree'

export function VariablesPanel() {
    const variableTree = useVariableTree()

    return (
        <div className="w-full h-full py-2">
            <div className="px-4 py-2 mb-1 text-sm font-semibold">变量系统</div>
            <div className="w-full h-[calc(100%-36px)] px-4 overflow-auto">
                <JsonView value={variableTree} enableClipboard={false} displayObjectSize={false} />
            </div>
        </div>
    )
}
