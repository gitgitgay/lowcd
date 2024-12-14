/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

// import { closeCompletion } from '@codemirror/autocomplete'
import '../style.css'

import {
    acceptCompletion,
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    closeCompletion,
    moveCompletionSelection,
} from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, defaultHighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { Compartment, EditorState, Prec } from '@codemirror/state'
import { dropCursor, EditorView, hoverTooltip, keymap, /* lineNumbers, */ tooltips } from '@codemirror/view'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { editableConfigure } from '../extensions/common/editableConfigure'
import { placeholderConfigure } from '../extensions/common/placeholderConfigure'
import { readOnlyConfigure } from '../extensions/common/readOnlyConfigure'
import { singleLineConfigure } from '../extensions/common/singleLineConfigure'
// import { dynamicCompletion } from '../extensions/completions/dynamic-completion'
import { staticCompletion } from '../extensions/completions/static-completion'
import { customHighlightPlugin } from '../extensions/highlighter/dynamicSyntaxHighlighter'
import { forbidRegExpDemoLinter } from '../extensions/linters/forbid-reg-exp-demo-linter'
import { changeUpdateListener } from '../extensions/listeners/changeUpdateListener'
import { focusUpdateListener } from '../extensions/listeners/focusUpdateListener'
// import { themeGrass } from '../extensions/themes/grass'
import { themeMiaoma } from '../extensions/themes/miaoma'
// import { docSizePlugin } from '../extensions/tools/docSize'
import { VariableEditorCoreProps } from '../types/editor'
import { intercept } from './variable-interceptor'

const language = new Compartment(),
    tabSize = new Compartment()

const wordHover = hoverTooltip((view, pos, side) => {
    const { from, to, text } = view.state.doc.lineAt(pos)
    let start = pos,
        end = pos
    while (start > from && /\w/.test(text[start - from - 1])) start--
    while (end < to && /\w/.test(text[end - from])) end++
    if ((start == pos && side < 0) || (end == pos && side > 0)) return null
    return {
        pos: start,
        end,
        above: true,
        create() {
            const dom = document.createElement('div')
            dom.textContent = text.slice(start - from, end - from)
            return { dom }
        },
    }
})

const basicExtension = [
    history(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    keymap.of([...defaultKeymap, ...closeBracketsKeymap, ...historyKeymap]),
]

export function VariableEditorCore(props: VariableEditorCoreProps) {
    const { className, value = '', editable = true, readOnly = false, placeholder, dataTree, onChange, onFocus, onBlur } = props
    const [focused, setFocused] = useState(false)
    const editorWrapperRef = useRef<HTMLDivElement>(null)
    const codeMirrorEditorViewRef = useRef<EditorView | null>(null)

    const tooltipExtension = useMemo(() => {
        return tooltips({
            position: 'absolute',
            parent: document.querySelector<HTMLElement>('.cm-editor') || document.body,
        })
    }, [])

    const keyMapExtensions = Prec.highest(
        keymap.of([
            { key: 'Escape', run: closeCompletion },
            { key: 'ArrowDown', run: moveCompletionSelection(true) },
            { key: 'ArrowUp', run: moveCompletionSelection(false) },
            { key: 'PageDown', run: moveCompletionSelection(true, 'page') },
            { key: 'PageUp', run: moveCompletionSelection(false, 'page') },
            { key: 'Tab', run: acceptCompletion },
            { key: 'Enter', run: acceptCompletion },
        ])
    )

    const latestValue = useRef(value)
    const [snippet, setSnippet] = useState(value ?? `Hello，{{user.info.name}}，{{user.info.age f * 2}}`)
    const [evalRes, setEvalRes] = useState('')
    const [evalError, setEvalError] = useState('')

    useEffect(() => {
        if (value !== latestValue.current) {
            latestValue.current = value
            setSnippet(value)
        }

        return () => {
            latestValue.current = ''
        }
    }, [value])

    useEffect(() => {
        if (!snippet || !dataTree) return
        const { result, error } = intercept(snippet, dataTree)
        setEvalRes(result)
        setEvalError(error)
    }, [dataTree, snippet])

    useEffect(() => {
        // 这样判断是为了避免重复渲染，导致编辑器内容丢失，同时解决性能问题
        if (!codeMirrorEditorViewRef.current || (!focused && value !== codeMirrorEditorViewRef.current.state.doc.toString())) {
            if (editorWrapperRef.current) {
                const state = EditorState.create({
                    doc: snippet,
                    extensions: [
                        // themeGrass,
                        basicExtension,
                        // 控制编辑器是否可编辑等
                        readOnlyConfigure(readOnly),
                        editableConfigure(editable),
                        placeholderConfigure(placeholder),
                        singleLineConfigure(false),
                        themeMiaoma,
                        forbidRegExpDemoLinter,
                        keymap.of(defaultKeymap),
                        // lineNumbers(),
                        tabSize.of(EditorState.tabSize.of(2)),
                        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                        // 自定义高亮插件
                        customHighlightPlugin,
                        language.of(javascript()),
                        tooltipExtension,
                        wordHover,
                        // docSizePlugin,
                        autocompletion({
                            override: [staticCompletion /* , dynamicCompletion */],
                            defaultKeymap: false,
                            closeOnBlur: false,
                        }),
                        keyMapExtensions,
                        // 事件相关
                        changeUpdateListener({
                            onChange(v) {
                                onChange?.(v)
                                setSnippet(v)
                            },
                        }),
                        focusUpdateListener({
                            onFocus() {
                                setFocused(true)
                                onFocus?.()
                            },
                            onBlur: (value: string) => {
                                setFocused(false)
                                onBlur?.(value)
                            },
                        }),
                    ],
                })
                // 如果编辑器已经存在，则更新编辑器状态，否则创建编辑器
                if (codeMirrorEditorViewRef.current) {
                    codeMirrorEditorViewRef.current.setState(state)
                } else {
                    codeMirrorEditorViewRef.current = new EditorView({
                        state,
                        parent: editorWrapperRef.current,
                    })
                }
            }
        }
    }, [editable, focused, keyMapExtensions, onBlur, onChange, onFocus, placeholder, readOnly, snippet, tooltipExtension, value])

    const styles = useMemo(() => {
        const wrapper = editorWrapperRef.current
        if (!wrapper) return {}
        const { top, left, width, height } = wrapper.getBoundingClientRect()
        const commonStyle: React.CSSProperties = {
            position: 'absolute',
            minWidth: width,
            width: width + 2,
            top: top + height + 1,
            left: left - 1,
            zIndex: 100,
            borderRadius: 8,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            fontSize: 13,
            padding: 8,
        }
        if (evalError) {
            return {
                ...commonStyle,
                borderColor: 'red',
                color: 'red',
                backgroundColor: 'rgb(252,237,232)',
            }
        }
        return {
            ...commonStyle,
            borderColor: focused ? 'rgb(229, 230, 235)' : '',
            color: 'rgb(11, 182, 69)',
            backgroundColor: 'rgb(232, 255, 236)',
        }
    }, [snippet, evalError, focused])

    const resultContent = evalError ? (
        <div style={styles}>
            {evalError && (
                <div>
                    <p style={{ fontWeight: 'bold', marginBottom: 4 }}>错误：</p>
                    <p>{evalError}</p>
                </div>
            )}
        </div>
    ) : (
        <div style={styles}>
            <div>
                <p style={{ fontWeight: 'bold', marginBottom: 4 }}>结果：String</p>
                <p>{evalRes || '-'}</p>
            </div>
        </div>
    )

    return (
        <div
            className={className}
            style={{
                border: '1px solid',
                borderColor: focused ? (evalError ? 'rgb(229,82,67)' : 'rgb(11, 182, 69)') : '#E4E4E7',
                borderRadius: 4,
                borderBottomLeftRadius: focused ? 0 : 4,
                borderBottomRightRadius: focused ? 0 : 4,
            }}
        >
            <div ref={editorWrapperRef}></div>
            {focused && createPortal(resultContent, document.body)}
        </div>
    )
}
