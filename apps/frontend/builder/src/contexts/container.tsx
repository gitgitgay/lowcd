/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import React from 'react'

interface ContainerContextValue {
    containerId: string
    children: React.ReactNode
}

export const ContainerContext = React.createContext<ContainerContextValue | null>(null)

export const ContainerProvider: React.FC<ContainerContextValue> = ({ containerId, children }) => {
    return <ContainerContext.Provider value={{ containerId, children }}>{children}</ContainerContext.Provider>
}

export const useContainer = () => {
    const context = React.useContext(ContainerContext)

    if (!context) {
        throw new Error('useContainer must be used within a ContainerProvider')
    }

    return context
}
