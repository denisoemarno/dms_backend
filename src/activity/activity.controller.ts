import {
    Controller,
    Request,
    Get,
    UseGuards,
    Param,
    HttpStatus,
    HttpCode,
    Post,
    BadRequestException,
    Put,
    Delete,
    Query,
    Logger,
    Inject,
    LoggerService,
    Body,
    ParseIntPipe,
    ParseArrayPipe,
    DefaultValuePipe,
    NotFoundException,
} from '@nestjs/common';

import {
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiTags,
    ApiQuery,
} from '@nestjs/swagger';

import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityService } from './activity.service';
import { AuthGuard } from '@nestjs/passport';
import { Activity as ActivityEntity } from './activity.entity';
import { ActivityDto, ActivityPaginateDto } from './dto/activity.dto';
import { Request as RequestBody } from 'express';

@Controller('activity')
@ApiTags('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    // @Get(':id')
    // @ApiOkResponse({ type: ActivityDto })
    // @ApiParam({ name: 'id', required: true })
    // findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ActivityDto> {
    //     return this.activityService.findOne(id);
    // }

    @Get(':docId')
    @ApiOkResponse({ type: [ActivityDto] })
    @ApiParam({ name: 'docId', required: true })
    findAll(
        @Param('docId', new ParseIntPipe()) id: number,
    ): Promise<ActivityDto[]> {
        return this.activityService.findByDocId(id);
    }

    @Post()
    @ApiCreatedResponse({ type: ActivityEntity })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createActivity: CreateActivityDto,
        @Request() request,
    ): Promise<ActivityEntity> {
        return this.activityService.create(request.user.id, request.user.firstName, createActivity);
    }
}
