import {
    Controller,
    Request,
    Get,
    Res,
    UseGuards,
    Param,
    UseInterceptors,
    UploadedFile,
    Post,
    Put,
    Delete,
    Query,
    Body,
    ParseIntPipe,
    HttpStatus,
    HttpCode,
    BadRequestException,
    Logger,
    Inject,
    LoggerService,
    ParseArrayPipe,
    DefaultValuePipe,
    NotFoundException,
    Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
    editFileName,
    imageFileFilter,
    documentFileFilter,
} from '../shared/utils/file-upload.utils';

import {
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiTags,
    ApiQuery,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TemplatesDto, TemplatesPaginateDto } from './dto/templates.dto';
import { CreateTemplatesDto } from './dto/create-templates.dto';
import { UpdateTemplatesDto } from './dto/update-templates.dto';
import { TemplatesService } from './templates.service';
import { Template as TemplateEntity } from './templates.entity';
import fs from 'fs';
import { create } from 'domain';

const storageOptions = diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        callback(null, editFileName(req, file, callback));
    },
});

export const ApiFile = (fileName: string = 'file'): MethodDecorator => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => {
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                [fileName]: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })(target, propertyKey, descriptor);
};

@Controller('templates')
@ApiTags('templates')
export class TemplatesController {
    constructor(private readonly templateService: TemplatesService) {}

    @Get('/all')
    @ApiOkResponse({ type: [TemplatesDto] })
    findAll(): Promise<TemplatesDto[]> {
        return this.templateService.findAll();
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            //storage: storageOptions,
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: documentFileFilter,
        }),
    )
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({ type: CreateTemplatesDto })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                name: {
                    type: 'string',
                    format: 'string',
                },
                // template: {
                //     type: 'string',
                //     format: 'string',
                // },
            },
        },
    })
    async uploadedFile(
        @UploadedFile() file,
        @Body() createTemplateDto: CreateTemplatesDto,
        @Request() request,
    ): Promise<TemplateEntity> {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        // const data = new CreateTemplatesDto();
        // data.name = createTemplateDto.name;
        // data.template = file.filename;

        //return response;
        return this.templateService.create(
            request.user.id,
            file.filename,
            createTemplateDto,
        );
    }

    @Get('view/:fileName')
    @ApiParam({ name: 'fileName', required: true })
    // @Header('Content-Type', 'application/pdf')
    //@Header('Content-Disposition', 'attachment; filename=test.pdf')
    seeUploadedFile(@Param('fileName') fileName, @Res() res) {
        //return fs.createReadStream('./uploads/' + image);
        return res.sendFile(fileName, { root: './uploads' });
    }

    @Get(':id')
    @ApiOkResponse({ type: TemplatesDto })
    @ApiParam({ name: 'id', required: true })
    findOne(
        @Param('id', new ParseIntPipe()) id: number,
    ): Promise<TemplatesDto> {
        return this.templateService.findOne(id);
    }

    // @Post()
    // @ApiCreatedResponse({ type: TemplateEntity })
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // create(
    //     @Body() createTagDto: CreateTemplatesDto,
    //     @Request() request,
    // ): Promise<TemplateEntity> {
    //     return this.templateService.create(request.user.id, createTagDto);
    // }

    @Put(':id')
    @ApiOkResponse({ type: UpdateTemplatesDto })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
        @Body() updateTemplatesDto: UpdateTemplatesDto,
    ): Promise<TemplateEntity> {
        return this.templateService.update(
            id,
            request.user.id,
            updateTemplatesDto,
        );
    }

    @Delete(':id')
    @ApiOkResponse({ type: TemplateEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Request() request,
    ): Promise<TemplateEntity> {
        return this.templateService.delete(id, request.user.id);
    }

    @Get('')
    @ApiOkResponse({ type: [TemplatesDto] })
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
    ): Promise<TemplatesPaginateDto> {
        return this.templateService.findGetAll(keyword, offset, limit);
    }
}
