/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
// 只负责装载工作

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PostgresModule } from 'nest-postgres'

import database from './config/database'
import { ApplicationModule } from './modules/application/application.module'
import { DataSourceModule } from './modules/data-source/data-source.module'

@Module({
    imports: [
        ApplicationModule,
        DataSourceModule,
        ConfigModule.forRoot({
            load: [database],
        }),
        PostgresModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const config = configService.get('database')
                const { username, ...restConfig } = config
                return {
                    ...restConfig,
                    user: username,
                }
            },
        }),
    ],
    providers: [],
})
export class AppModule {}
