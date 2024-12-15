/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectConnection } from 'nest-postgres'
import { Client } from 'pg'

@Injectable()
export class DataSourceService {
    // constructor(/* @Inject('ConfigService') private readonly configService: ConfigService */) {}
    constructor(
        private configService: ConfigService,
        @InjectConnection() private readonly connection: Client
    ) {}

    async create() {
        const id = new Date().getTime()
        // 开始事务
        try {
            await this.connection.query('BEGIN;')

            const res = await this.connection.query(`
                CREATE TABLE database.tb${id}
                    (
                        c1 TEXT,
                        c2 NUMERIC,
                        c3 BOOLEAN,
                        c4 JSONB
                    );
                    -- 往元数据表中插入表信息
                    INSERT INTO database_meta.tables (table_id, table_name)
                    VALUES ('tb1', '妙码学院@新建数据源');
                    -- 往元数据表中插入列信息
                    INSERT INTO database_meta.columns (table_id, column_id, column_name, type)
                    VALUES ('tb1', 'c1', '姓名', 'TEXT')
                        , ('tb1', 'c2', '年龄', 'NUMERIC')
                        , ('tb1', 'c3', '是否成年', 'BOOLEAN')
                        , ('tb1', 'c4', '爱好', 'JSONB');
                `)
            // 提交事务
            await this.connection.query('COMMIT;')

            return res.rows
        } catch (error) {
            // 如果失败了的话
            await this.connection.query('ROLLBACK;')
            return new HttpException('Create Failed', 500, error.message)
        }
    }

    async appendData(id: string) {
        this.connection.query(`
            -- 追加数据
            INSERT INTO database.${id} (c1, c2, c3, c4)
            VALUES ('合一妙码', 18, TRUE, '["排球", "篮球"]');
            `)
    }

    async createColumn() {
        const dbId = 'tb1'
        const columnId = `c${new Date().getTime()}`
        const columnType = 'TEXT'
        const columnName = '描述'
        this.connection.query(`
            -- 创建列
            ALTER TABLE database.${dbId}
            ADD COLUMN ${columnId} TEXT;
            -- 往元数据表中插入列信息
            INSERT INTO database_meta.columns (table_id, column_id, column_name, type)
            VALUES ('${dbId}', '${columnId}', '${columnName}', '${columnType}')
        `)
    }

    async list() {
        Logger.log(this.configService.get('database'))
        return 'list'
    }

    async fetchOne(id: string) {
        try {
            const res = await this.connection.query(`SELECT * FROM database.${id};`)
            const columns = await this.connection.query(`
                    SELECT * FROM database_meta.columns
                        WHERE table_id = '${id}';
                `)
            return { rows: res.rows, columns: columns.rows }
        } catch (error) {
            return new HttpException('Not Found', 404, error.message)
        }
    }
}
