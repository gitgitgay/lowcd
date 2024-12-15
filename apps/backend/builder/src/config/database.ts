/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { join } from 'node:path'

export default () => {
    return {
        database: {
            type: 'postgres',
            host: '192.168.31.68',
            port: 5432,
            username: 'miaoma',
            password: 'miaoma123',
            database: 'lowcode',
        },
        typeorm: {
            entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
            synchronize: true,
        },
    }
}
