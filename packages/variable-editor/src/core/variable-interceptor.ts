/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { evalScript } from '../codeSandbox'
import { getSnippetString } from '../utilities/getSnippetString'

export const intercept = (script: string, dataTree: Record<string, any>) => {
    const snippetScript = getSnippetString(script)
    let evalResult = script
    let evalError = ''
    try {
        const results =
            snippetScript?.map(script => {
                const scriptValue = script.replace(/{{|}}/g, '')
                return evalScript(scriptValue, dataTree)
            }) ?? []

        for (let i = 0; i < results.length; i++) {
            const result = results[i]
            evalResult = evalResult.replace(snippetScript?.[i] as string, result)
        }
    } catch (error) {
        // @ts-expect-error error
        evalError = error.message
    }
    return { result: evalResult, error: evalError }
}
