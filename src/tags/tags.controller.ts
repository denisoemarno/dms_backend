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

import { CreateTagsDto } from './dto/create-tags.dto';
import { TagsService } from './tags.service';
import { AuthGuard } from '@nestjs/passport';
import { Tags as TagsEntity } from './tags.entity';
import { TagsDto, TagsPaginateDto } from './dto/tags.dto';
// import { Request } from 'express';
import { Request as RequestBody } from 'express';
import { UpdateTagsDto } from './dto/update-tags.dto';

import { Response } from 'express';
import { Observable } from 'rxjs';

@Controller('tags')
@ApiTags('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get('/all')
    @ApiOkResponse({ type: [TagsDto] })
    findAll(): Promise<TagsDto[]> {
        return this.tagsService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: TagsDto })
    @ApiParam({ name: 'id', required: true })
    findOne(@Param('id', new ParseIntPipe()) id: number): Promise<TagsDto> {
        return this.tagsService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: TagsEntity })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createTagDto: CreateTagsDto,
        @Request() request,
    ): Promise<TagsEntity> {
        return this.tagsService.create(request.user.id, createTagDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: TagsEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
        @Body() UpdateTagDto: UpdateTagsDto,
    ): Promise<TagsEntity> {
        return this.tagsService.update(id, request.user.id, UpdateTagDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: TagsEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
    ): Promise<TagsEntity> {
        return this.tagsService.delete(id, request.user.id);
    }

    @Get('')
    @ApiOkResponse({ type: [TagsDto] })
    @ApiQuery({
        name: 'q',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'offset',
        required: true,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: true,
        type: Number,
    })
    getAllTags(
        @Query('q') keyword?: string,
        @Query('limit', new DefaultValuePipe(10), new ParseIntPipe())
        limit?: number,
        @Query('offset', new DefaultValuePipe(0), new ParseIntPipe())
        offset?: number,
    ): Promise<TagsPaginateDto> {
        return this.tagsService.findGetAll(keyword, offset, limit);
    }
}
