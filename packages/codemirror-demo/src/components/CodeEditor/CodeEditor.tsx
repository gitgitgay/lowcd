/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import {
    acceptCompletion,
    autocompletion,
    closeBrackets,
    closeCompletion,
    CompletionContext,
    // completionKeymap,
} from '@codemirror/autocomplete'
import { defaultKeymap, history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorState, Prec } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { useEffect, useRef } from 'react'

import { themeMiaoma } from './miaoma'

// 状态
// 视图
// 插件

const changeUpdateListener = () => {
    return EditorView.updateListener.of(update => {
        if (update.docChanged) {
            // const value = update.state.doc.toString()
        }
    })
}

// 自动补全
// function staticCompletion(context: CompletionContext) {
//     // const word = context.matchBefore(/\w*/) // 匹配输入的当前单词
//     const word = context.matchBefore(/{\{\s*/) // 匹配输入的当前单词
//     if (word === null || (word && word.from === word.to)) return null // 如果没有输入，返回空

//     // 真正的 options 是由语法服务返回，LSP（Language Server Protocol）
//     return {
//         from: word ? word.to : context.pos,
//         validFor: /^\w*$/,
//         options: [
//             { label: 'function', type: 'keyword', detail: 'Keyword' },
//             { label: 'const', type: 'keyword', detail: 'Keyword' },
//             { label: 'let', type: 'keyword', detail: 'Keyword' },
//             { label: 'var', type: 'keyword', detail: 'Keyword' },
//             { label: 'user', type: 'Object', detail: 'Object' },
//             { label: 'currentUser', type: 'Object', detail: 'Object' },
//             // { label: 'console.log', type: 'function', info: 'Log to console' },
//             { label: 'console', type: 'Function', detail: 'Function' },
//             { label: 'currentUserInfo', type: 'Object', detail: 'Object' },
//         ],
//     }
// }

async function dynamicCompletion(context: CompletionContext) {
    const dynamicOptions = await fetchDynamicOptions() // 从外部获取补全数据
    // const word = context.matchBefore(/\w*/)
    const word = context.matchBefore(/.*\{\{\s*/) // 匹配输入的当前单词
    if (word === null || (word && word.from === word.to)) return null // 如果没有输入，返回空
    return {
        // from: word ? word.from : context.pos,
        from: word ? word.from + context.pos : context.pos,
        // validFor: /^\w*$/,
        options: dynamicOptions.map(item => ({ label: item, type: 'keyword' })),
    }
}

const options: string[] = []
let i = 0

setInterval(() => {
    options.push('newOption' + i++)
}, 1000)

function fetchDynamicOptions() {
    // 示例：从服务器获取关键词
    return options
}

const keyMapExtensions = Prec.highest(
    keymap.of([
        { key: 'Escape', run: closeCompletion },
        // { key: 'ArrowDown', run: moveCompletionSelection(true) },
        // { key: 'ArrowUp', run: moveCompletionSelection(false) },
        // { key: 'PageDown', run: moveCompletionSelection(true, 'page') },
        // { key: 'PageUp', run: moveCompletionSelection(false, 'page') },
        { key: 'Tab', run: acceptCompletion },
        { key: 'Enter', run: acceptCompletion },
    ])
)

export function CodeEditor() {
    const viewWrapperRef = useRef<HTMLDivElement>(null)
    const viewInstanceRef = useRef<EditorView | null>(null)
    useEffect(() => {
        const state = EditorState.create({
            doc: 'Hello, 妙码学院',
            extensions: [
                themeMiaoma, // 主题
                // lineNumbers(), // 行号插件
                closeBrackets(), // 自动闭合括号
                keymap.of(defaultKeymap), // 默认快捷键
                history(), // 撤销重做
                autocompletion({
                    // override: [staticCompletion /* , dynamicCompletion */],
                    override: [dynamicCompletion],
                    defaultKeymap: false,
                    closeOnBlur: false,
                }),
                keyMapExtensions,

                // 相关的包共同作用的结果
                javascript(), // 语法解析
                // sql(), // 语法解析
                // json(), // 语法解析
                syntaxHighlighting(defaultHighlightStyle), // 语法高亮
                changeUpdateListener(), // 监听器
            ], // 所有的逻辑全都是通过插件来实现的
        })

        viewInstanceRef.current = new EditorView({
            state,
            parent: viewWrapperRef.current!,
        })
    }, [])

    return <div ref={viewWrapperRef}></div>
}
