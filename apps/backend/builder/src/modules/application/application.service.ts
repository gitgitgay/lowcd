/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApplicationService {
    // constructor(/* @Inject('ConfigService') private readonly configService: ConfigService */) {}
    constructor(private configService: ConfigService) {}

    async list() {
        Logger.log(this.configService.get('database'))
        return 'list'
    }
}
