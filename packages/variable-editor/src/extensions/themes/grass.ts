/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { EditorView } from '@codemirror/view'

export const themeGrass = EditorView.theme(
    {
        '&': {
            color: 'white',
            backgroundColor: '#034',
        },
        '.cm-content': {
            caretColor: '#0e9',
        },
        '&.cm-focused .cm-cursor': {
            borderLeftColor: '#0e9',
        },
        '&.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: '#074',
        },
        '.cm-gutters': {
            backgroundColor: '#045',
            color: '#ddd',
            border: 'none',
        },
    },
    { dark: true }
)
