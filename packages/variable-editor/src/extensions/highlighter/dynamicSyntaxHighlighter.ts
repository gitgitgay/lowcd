/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { RangeSetBuilder } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'

// 高亮路径的正则表达式
const dynamicHighlightRegex = /\b(?:user(?:\.\w+)*)\b/g

// 自定义高亮插件
function customHighlight(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    const text = view.state.doc.toString()

    // 遍历所有匹配项并为其添加高亮
    for (let match; (match = dynamicHighlightRegex.exec(text)); ) {
        const from = match.index
        const to = from + match[0].length

        // 定义高亮样式
        builder.add(
            from,
            to,
            Decoration.mark({
                class: 'dynamic-highlight',
            })
        )
    }

    return builder.finish()
}

// 创建装饰器插件
export const customHighlightPlugin = EditorView.decorations.compute(['doc'], state => {
    return customHighlight({ state } as EditorView)
})
