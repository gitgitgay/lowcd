/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DataSourceController } from './data-source.controller'
import { DataSourceService } from './data-source.service'

@Module({
    imports: [ConfigModule],
    controllers: [DataSourceController],
    providers: [DataSourceService],
    exports: [],
})
export class DataSourceModule {}
