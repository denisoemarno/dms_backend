const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import { Logger } from '@nestjs/common';

import { User } from './../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentType } from './documenttype.entity';

// DTO
import {
    DocumentTypeDto,
    DocumentTypePaginateDto,
} from './dto/documenttype.dto';
import { CreateDocumentTypeDto } from './dto/create-documenttype.dto';
import { UpdateDocumentTypeDto } from './dto/update-documenttype.dto';
import { Workflow } from './../shared/entity/workflow.entity';

@Injectable()
export class DocumentTypeService {
    constructor(
        @Inject('DocumenttypeRepository')
        private readonly documentTypeProviders: typeof DocumentType,
    ) {}

    async findAll(): Promise<DocumentTypeDto[]> {
        const data = await this.documentTypeProviders.findAll<DocumentType>({
            include: [User, Workflow],
        });
        return data.map(data => {
            return new DocumentTypeDto(data);
        });
    }

    async findGetAll(
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<DocumentTypePaginateDto> {
        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.documentTypeProviders.findAndCountAll({
                include: [User, Workflow],
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            return new DocumentTypePaginateDto(data.count, data.rows);
        } else {
            const data = await this.documentTypeProviders.findAndCountAll({
                include: [User, Workflow],
                offset: offsetNumber,
                limit: limit,
            });
            //Logger.log(data);

            return new DocumentTypePaginateDto(data.count, data.rows);
        }
    }

    async findOne(id: number): Promise<DocumentTypeDto> {
        const tags = await this.documentTypeProviders.findByPk<DocumentType>(
            id,
            {
                // include: [User],
            },
        );
        if (!tags) {
            throw new HttpException(
                'No document id found',
                HttpStatus.NOT_FOUND,
            );
        }

        return new DocumentTypeDto(tags);
    }

    async create(createDocumentTypeDto: CreateDocumentTypeDto) {
        const fileTypes = new DocumentType();
        fileTypes.name = createDocumentTypeDto.name;
        fileTypes.workflow_id = createDocumentTypeDto.workflow_id;
        return fileTypes.save();
    }

    private async getFindById(id: number) {
        const data = await this.documentTypeProviders.findByPk<DocumentType>(
            id,
        );
        if (!data) {
            throw new HttpException(
                'No Document Type found',
                HttpStatus.NOT_FOUND,
            );
        }
        return data;
    }

    async update(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
        const data = await this.getFindById(id);
        data.name = updateDocumentTypeDto.name || data.name;
        data.workflow_id =
            updateDocumentTypeDto.workflow_id || data.workflow_id;
        return data.save();
    }

    async delete(id: number) {
        const row = await this.getFindById(id);
        await row.destroy();
        return row;
    }
}
