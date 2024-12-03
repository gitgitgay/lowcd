/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Button } from '@/icons/blocks/button'
import { Container } from '@/icons/blocks/container'
import { Divider } from '@/icons/blocks/divider'
import { Icon } from '@/icons/blocks/icon'
import { Image } from '@/icons/blocks/image'
import { Text } from '@/icons/blocks/text'

const GROUPED_COMPONENTS_LIST = [
    {
        type: 'basic',
        name: '基础',
        color: '#6C5DE7',
        components: [
            {
                type: 'button',
                name: '按钮',
                icon: <Button />,
            },
            {
                type: 'text',
                name: '文本',
                icon: <Text />,
            },
            {
                type: 'container',
                name: '容器',
                icon: <Container />,
            },
            {
                type: 'image',
                name: '图片',
                icon: <Image />,
            },
            {
                type: 'icon',
                name: '图标',
                icon: <Icon />,
            },
            {
                type: 'divider',
                name: '分割线',
                icon: <Divider />,
            },
        ],
    },
    {
        type: 'layout',
        name: '布局',
        color: '#F9A826',
        components: [
            {
                type: 'container',
                name: '容器',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="none" id="icon-import">
                        <path d="M21 4H18V2H21C22.6569 2 24 3.34315 24 5V8H22V5C22 4.44772 21.5523 4 21 4Z" fill="var(--fg-color)" />
                        <path d="M2 8V5C2 4.44772 2.44771 4 3 4H6V2H3C1.34315 2 0 3.34315 0 5V8H2Z" fill="var(--fg-color)" />
                        <path d="M0 16V19C0 20.6569 1.34315 22 3 22H6V20H3C2.44772 20 2 19.5523 2 19V16H0Z" fill="var(--fg-color)" />
                        <path
                            d="M22 16H24V19C24 20.6569 22.6569 22 21 22H18V20H21C21.5523 20 22 19.5523 22 19V16Z"
                            fill="var(--fg-color)"
                        />
                        <g opacity="0.5">
                            <path d="M18 2H6V4H18V2Z" fill="var(--fg-color)" />
                            <path d="M18 20H6V22H18V20Z" fill="var(--fg-color)" />
                            <path d="M22 8H24V16H22V8Z" fill="var(--fg-color)" />
                            <path d="M2 8H0V17H2V8Z" fill="var(--fg-color)" />
                        </g>
                    </svg>
                ),
            },
        ],
    },
    {
        type: 'media',
        name: '媒体',
        color: '#00B894',
        components: [
            {
                type: 'image',
                name: '图片',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="none" id="icon-import">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 5.33333C2 3.49238 3.34315 2 5 2H19C20.6569 2 22 3.49238 22 5.33333V18.6667C22 20.5076 20.6569 22 19 22H5C3.34315 22 2 20.5076 2 18.6667V5.33333ZM10.3929 15.6911L8.46372 13.3199C8.2274 13.0295 7.78163 13.0366 7.5547 13.3345L4.70797 17.0708C4.4178 17.4516 4.6894 18 5.16819 18H18.857C19.3311 18 19.604 17.461 19.3232 17.0789L15.3155 11.6239C15.0866 11.3124 14.6226 11.3086 14.3886 11.6163L11.3023 15.6761C11.0755 15.9744 10.6294 15.9817 10.3929 15.6911ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                            fill="var(--fg-color)"
                        />
                    </svg>
                ),
            },
        ],
    },
]

export function ComponentPanel() {
    return (
        <div
            className="w-full h-full"
            style={
                {
                    '--bg-color': '#fff',
                    '--fg-color': '#fff',
                } as React.CSSProperties
            }
        >
            {GROUPED_COMPONENTS_LIST.map(group => (
                <div key={group.name} className="mb-4 pt-4">
                    <div className="text-sm font-semibold px-4 mb-4">{group.name}</div>
                    <div className="grid grid-cols-4 px-2">
                        {group.components.map(component => (
                            <div
                                key={`${group.type}-${component.type}`}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-zinc-100 cursor-pointer select-none"
                            >
                                <div
                                    className="size-8 p-1 rounded-md shadow-md"
                                    style={{
                                        backgroundColor: group.color,
                                    }}
                                >
                                    {component.icon}
                                </div>
                                <div className="text-xs text-zinc-500">{component.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
