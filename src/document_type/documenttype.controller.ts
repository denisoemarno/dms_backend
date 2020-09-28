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

import { CreateDocumentTypeDto } from './dto/create-documenttype.dto';
import { DocumentTypeService } from './documenttype.service';
import { AuthGuard } from '@nestjs/passport';
import { DocumentType as DocumentTypeEntity } from './documenttype.entity';
import {
    DocumentTypeDto,
    DocumentTypePaginateDto,
} from './dto/documenttype.dto';
import { Request as RequestBody } from 'express';
import { UpdateDocumentTypeDto } from './dto/update-documenttype.dto';

import { Response } from 'express';
import { Observable } from 'rxjs';

@Controller('document-type')
@ApiTags('document-type')
export class DocumentTypeController {
    constructor(private readonly documentTypeService: DocumentTypeService) {}

    @Get('/all')
    @ApiOkResponse({ type: [DocumentTypeDto] })
    findAll(): Promise<DocumentTypeDto[]> {
        return this.documentTypeService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: DocumentTypeDto })
    @ApiParam({ name: 'id', required: true })
    findOne(
        @Param('id', new ParseIntPipe()) id: number,
    ): Promise<DocumentTypeDto> {
        return this.documentTypeService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: CreateDocumentTypeDto })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createDocumentTypeDto: CreateDocumentTypeDto,
        @Request() request,
    ): Promise<DocumentTypeEntity> {
        return this.documentTypeService.create(createDocumentTypeDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: UpdateDocumentTypeDto })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
        @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
    ): Promise<DocumentTypeEntity> {
        return this.documentTypeService.update(id, updateDocumentTypeDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: DocumentTypeDto })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
    ): Promise<DocumentTypeEntity> {
        return this.documentTypeService.delete(id);
    }

    @Get('')
    @ApiOkResponse({ type: [DocumentTypeDto] })
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
    ): Promise<DocumentTypePaginateDto> {
        return this.documentTypeService.findGetAll(keyword, offset, limit);
    }
}
