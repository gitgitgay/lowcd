/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const singleLineConfigure = (singleLine: boolean) =>
    singleLine ? EditorState.transactionFilter.of(tr => (tr.newDoc.lines > 1 ? [] : [tr])) : EditorView.lineWrapping
