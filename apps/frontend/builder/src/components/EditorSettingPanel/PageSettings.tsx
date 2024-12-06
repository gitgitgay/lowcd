import { Skeleton } from '@miaoma-lowcode/shadcn/components/ui/skeleton'

/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
export function PageSettings() {
    return (
        <div>
            <div className="px-4 py-3 text-sm font-semibold">页面设置</div>
            <div className="flex flex-col space-y-3 px-4">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    )
}
