import {
    Controller,
    Req,
    Get,
    UseGuards,
    Param,
    HttpStatus,
    HttpCode,
    Post,
    Request,
    BadRequestException,
    UploadedFiles,
    UseInterceptors,
    Put,
    Delete,
    Query,
    Logger,
    Inject,
    LoggerService,
    Body,
    UsePipes,
    ParseIntPipe,
    ParseArrayPipe,
    DefaultValuePipe,
    NotFoundException,
    ValidationPipe,
    Res,
    UploadedFile,
} from '@nestjs/common';

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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
    editFileName,
    imageFileFilter,
    documentFileFilter,
    documentFilesFilter,
} from '../shared/utils/file-upload.utils';

import { CreateDocumentsDto } from './dto/create-documents.dto';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { Documents as DocumentsEntity } from './document.entity';
import { DocumentsDto, DocumentsPaginateDto } from './dto/documents.dto';
// import { Request } from 'express';
import { Request as RequestBody } from 'express';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { UpdateApprovalDocumentsDto } from './dto/update-approval-documents.dto';
import { UpdateApprovalS4DocumentsDto } from './dto/update-approvals4-documents.dto';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { UserIsUserGuard } from '../users/auth/guards/UserIsUser.guard';
import { WorkflowFlowDto } from './dto/workflowFlow.dto';

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

@Controller('documents')
@ApiTags('documents')
export class DocumentsController {
    constructor(private readonly docService: DocumentsService) {}

    @Get('')
    @ApiOkResponse({ type: [DocumentsDto] })
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
    ): Promise<DocumentsPaginateDto> {
        return this.docService.findGetAll(keyword, offset, limit);
    }

    @Get(':id')
    @ApiOkResponse({ type: DocumentsDto })
    @ApiParam({ name: 'id', required: true })
    findOne(
        @Param('id', new ParseIntPipe()) id: number,
    ): Promise<DocumentsDto> {
        return this.docService.findOne(id);
    }

    // @UsePipes(new ValidationPipe({ transform: true }))
    @Post()
    @ApiCreatedResponse({ type: DocumentsEntity })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createDocumentsDto: CreateDocumentsDto,
        @Req() request,
    ): Promise<DocumentsEntity> {
        return this.docService.create(
            request.user.id,
            request.user.firstName,
            createDocumentsDto,
        );
    }

    @Put('approval/:id')
    @ApiOkResponse({ type: DocumentsEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    updateApproval(
        @Param('id', new ParseIntPipe()) id: number,
        @Req() request,
        @Body() updateApprovalDocumentsDto: UpdateApprovalDocumentsDto,
    ): Promise<DocumentsEntity> {
        return this.docService.updateApproval(
            id,
            request.user.id,
            request.user.firstName,
            updateApprovalDocumentsDto,
        );
    }

    @Put('approvalS4/:id')
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            //storage: storageOptions,
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: documentFileFilter,
        }),
    )
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({ type: DocumentsEntity })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                tags: {
                    type: 'array',
                    items: {
                        type: 'array',
                        format: 'string',
                    },
                },
                parameter: {
                    type: 'string',
                    format: 'string',
                },
            },
        },
    })
    async UploadedFile(
        @Param('id', new ParseIntPipe()) id: number,
        @UploadedFiles() files,
        @Body() body: any,
        //@Body() updateApprovalS4DocumentsDto: UpdateApprovalS4DocumentsDto,
        @Request() request,
    ): Promise<DocumentsEntity> {
        // const resFile = [];
        // files.forEach(file => {
        //     const fileReponse = {
        //         originalname: file.originalname,
        //         filename: file.filename,
        //     };
        //     resFile.push(fileReponse);
        // });
        console.log(files);
        console.log(body);
        // return null;

        return this.docService.updateApprovalS4(
            id,
            request.user.id,
            request.user.firstName,
            files,
            body
        );
    }

    @Put(':id')
    @ApiOkResponse({ type: DocumentsEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Req() request,
        @Body() updateDocumentsDto: UpdateDocumentsDto,
    ): Promise<DocumentsEntity> {
        return this.docService.update(id, request.user.id, updateDocumentsDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: DocumentsEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Req() request,
    ): Promise<DocumentsEntity> {
        return this.docService.delete(id, request.user.id);
    }

    @Get('owner/me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: [DocumentsDto] })
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
    getOwn(
        @Req() request,
        @Query('q') keyword?: string,
        @Query('limit', new DefaultValuePipe(10), new ParseIntPipe())
        limit?: number,
        @Query('offset', new DefaultValuePipe(0), new ParseIntPipe())
        offset?: number,
    ): Promise<DocumentsPaginateDto> {
        console.log(request.user.id);
        return this.docService.findGetOwn(
            request.user.id,
            keyword,
            offset,
            limit,
        );
    }

    @Get('task/me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: [DocumentsDto] })
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
    getTask(
        @Req() request,
        @Query('q') keyword?: string,
        @Query('limit', new DefaultValuePipe(10), new ParseIntPipe())
        limit?: number,
        @Query('offset', new DefaultValuePipe(0), new ParseIntPipe())
        offset?: number,
    ): Promise<DocumentsPaginateDto> {
        console.log(request.user.role);
        return this.docService.findGetTask(
            request.user.id,
            request.user.role,
            keyword,
            offset,
            limit,
        );
    }

    @Get('parameter/workflow')
    //@ApiBearerAuth()
    @ApiOkResponse({ type: [WorkflowFlowDto] })
    @ApiQuery({
        name: 'workflowStatus',
        required: true,
        type: String,
    })
    getParameterWorkflow(
        @Query('workflowStatus') workflowStatus?: string,
    ): Promise<WorkflowFlowDto[]> {
        console.log(workflowStatus);
        return this.docService.findGetParameterWorkflow(workflowStatus);
    }

    @Get('view/:fileName')
    @ApiParam({ name: 'fileName', required: true })
    // @Header('Content-Type', 'application/pdf')
    //@Header('Content-Disposition', 'attachment; filename=test.pdf')
    seeUploadedFile(@Param('fileName') fileName, @Res() res) {
        //return fs.createReadStream('./uploads/' + image);
        return res.sendFile(fileName, { root: './uploads' });
    }
}
