/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
// nestjs 工厂模式
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './fundamentals/filters/http-exception.filter'

async function bootstrap() {
    // 创建应用
    const app = await NestFactory.create(AppModule)

    // 统一使用 filter
    app.useGlobalFilters(new HttpExceptionFilter())

    await app.listen(8082)
}

bootstrap()
