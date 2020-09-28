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

import { CreateFileTypesDto } from './dto/create-filetypes.dto';
import { FiletypesService } from './filetypes.service';
import { AuthGuard } from '@nestjs/passport';
import { Filetypes as FileTypesEntity, Filetypes } from './filetypes.entity';
import { FileTypesDto, FiletypesPaginateDto } from './dto/filetypes.dto';
import { Request as RequestBody } from 'express';
import { UpdateFileTypesDto } from './dto/update-filetypes.dto';

import { Response } from 'express';
import { Observable } from 'rxjs';

@Controller('file-types')
@ApiTags('file-types')
export class FiletypesController {
    constructor(private readonly fileTypesService: FiletypesService) {}

    // @Get()
    // @ApiOkResponse({ type: [TagsDto] })
    // findAll(): Promise<TagsDto[]> {
    //     return this.tagsService.findAll();
    // }

    @Get(':id')
    @ApiOkResponse({ type: FileTypesDto })
    @ApiParam({ name: 'id', required: true })
    findOne(
        @Param('id', new ParseIntPipe()) id: number,
    ): Promise<FileTypesDto> {
        return this.fileTypesService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: FileTypesEntity })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createFileTypesDTO: CreateFileTypesDto,
        @Request() request,
    ): Promise<Filetypes> {
        return this.fileTypesService.create(createFileTypesDTO);
    }

    @Put(':id')
    @ApiOkResponse({ type: FileTypesEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
        @Body() updateFileTypesDto: UpdateFileTypesDto,
    ): Promise<FileTypesEntity> {
        return this.fileTypesService.update(id, updateFileTypesDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: FileTypesEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
    ): Promise<FileTypesEntity> {
        return this.fileTypesService.delete(id);
    }

    @Get('')
    @ApiOkResponse({ type: [FileTypesDto] })
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
    ): Promise<FiletypesPaginateDto> {
        return this.fileTypesService.findGetAll(keyword, offset, limit);
    }
}
