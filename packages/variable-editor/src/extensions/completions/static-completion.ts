/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { CompletionContext } from '@codemirror/autocomplete'

export function staticCompletion(context: CompletionContext) {
    // const word = context.matchBefore(/\w*/) // 匹配输入的当前单词
    const word = context.matchBefore(/{\{\s*/) // 匹配输入的当前单词
    if (word === null || (word && word.from === word.to)) return null // 如果没有输入，返回空

    return {
        from: word ? word.to : context.pos,
        validFor: /^\w*$/,
        options: [
            { label: 'function', type: 'keyword', detail: 'Keyword' },
            { label: 'const', type: 'keyword', detail: 'Keyword' },
            { label: 'let', type: 'keyword', detail: 'Keyword' },
            { label: 'var', type: 'keyword', detail: 'Keyword' },
            { label: 'user', type: 'Object', detail: 'Object' },
            { label: 'currentUser', type: 'Object', detail: 'Object' },
            // { label: 'console.log', type: 'function', info: 'Log to console' },
            { label: 'console', type: 'Function', detail: 'Function' },
        ],
    }
}
