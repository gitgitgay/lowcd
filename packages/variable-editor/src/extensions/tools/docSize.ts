/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EditorView, ViewPlugin } from '@codemirror/view'

export const docSizePlugin = ViewPlugin.fromClass(
    class {
        constructor(view: EditorView) {
            this.dom = view.dom.appendChild(document.createElement('div'))
            this.dom.style.cssText = 'position: absolute; inset-block-start: 2px; inset-inline-end: 5px; font-size: 12px; color: #777'
            this.dom.textContent = view.state.doc.length
        }

        update(update) {
            if (update.docChanged) this.dom.textContent = update.state.doc.length
        }

        destroy() {
            this.dom.remove()
        }
    }
)
