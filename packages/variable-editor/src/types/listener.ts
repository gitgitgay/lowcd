/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
/**
 * 编辑器内容更新监听器参数
 */
export interface ChangeUpdateListenerParams {
    onChange?: (value: string) => void
}

/**
 * 编辑器焦点更新监听器参数
 */
export interface ChangeUpdateListenerParams {
    onFocus?: () => void
    onBlur?: (value: string) => void
}
