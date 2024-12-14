/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { EditorView } from '@codemirror/view'

import { ChangeUpdateListenerParams } from '../../types/listener'

export const changeUpdateListener = (params: ChangeUpdateListenerParams) => {
    return EditorView.updateListener.of(update => {
        if (update.docChanged) {
            const value = update.state.doc.toString()
            params.onChange?.(value)
        }
    })
}
