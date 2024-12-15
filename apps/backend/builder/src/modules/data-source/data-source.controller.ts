/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { Controller, Get, Param, Post, Query } from '@nestjs/common'

import { DataSourceService } from './data-source.service'

@Controller('dataSource')
export class DataSourceController {
    constructor(private readonly dataSourceService: DataSourceService) {}

    @Post('create')
    create() {
        return this.dataSourceService.create()
    }

    @Post('append-data')
    appendData(@Query('id') id: string) {
        return this.dataSourceService.appendData(id)
    }

    @Post('create-column')
    createColumn() {
        return this.dataSourceService.createColumn()
    }

    @Get('list')
    list() {
        return this.dataSourceService.list()
    }

    @Get(':id')
    fetchOne(@Param('id') id: string) {
        return this.dataSourceService.fetchOne(id)
    }
}
