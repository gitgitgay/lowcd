/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { syntaxTree } from '@codemirror/language'
import { Diagnostic, linter } from '@codemirror/lint'

export const forbidRegExpDemoLinter = linter(view => {
    const diagnostics: Diagnostic[] = []
    syntaxTree(view.state)
        .cursor()
        .iterate(node => {
            if (node.name == 'RegExp')
                diagnostics.push({
                    from: node.from,
                    to: node.to,
                    severity: 'error',
                    message: 'Regular expressions are FORBIDDEN',
                    actions: [
                        {
                            name: 'Remove',
                            apply(view, from, to) {
                                view.dispatch({ changes: { from, to } })
                            },
                        },
                    ],
                })
        })
    return diagnostics
})
