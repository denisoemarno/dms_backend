const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import { Logger } from '@nestjs/common';

import { User } from './../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Filetypes } from './filetypes.entity';

// DTO
import { FileTypesDto, FiletypesPaginateDto } from './dto/filetypes.dto';
import { CreateFileTypesDto } from './dto/create-filetypes.dto';
import { UpdateFileTypesDto } from './dto/update-filetypes.dto';

@Injectable()
export class FiletypesService {
    constructor(
        @Inject('FiletypesRepository')
        private readonly fileTypesRepository: typeof Filetypes,
    ) {}

    async findAll(): Promise<FileTypesDto[]> {
        const data = await this.fileTypesRepository.findAll<Filetypes>({
            include: [User],
        });
        return data.map(data => {
            return new FileTypesDto(data);
        });
    }

    async findGetAll(
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<FiletypesPaginateDto> {
        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.fileTypesRepository.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            return new FiletypesPaginateDto(data.count, data.rows);
        } else {
            const data = await this.fileTypesRepository.findAndCountAll({
                offset: offsetNumber,
                limit: limit,
            });
            Logger.log(data);

            return new FiletypesPaginateDto(data.count, data.rows);
        }
    }

    async findOne(id: number): Promise<FileTypesDto> {
        const tags = await this.fileTypesRepository.findByPk<Filetypes>(id, {
            // include: [User],
        });
        if (!tags) {
            throw new HttpException(
                'No file types found',
                HttpStatus.NOT_FOUND,
            );
        }

        return new FileTypesDto(tags);
    }

    async create(createFileTypesDto: CreateFileTypesDto) {
        const fileTypes = new Filetypes();
        //fileTypes.userId = userId;
        fileTypes.name = createFileTypesDto.name;
        fileTypes.no_of_files = createFileTypesDto.no_of_files;
        fileTypes.labels = createFileTypesDto.labels;
        fileTypes.file_validations = createFileTypesDto.file_validations;
        fileTypes.file_maxsize = createFileTypesDto.file_maxsize;
        return fileTypes.save();
    }

    private async getFindById(id: number) {
        const tag = await this.fileTypesRepository.findByPk<Filetypes>(id);
        if (!tag) {
            throw new HttpException(
                'No file types found',
                HttpStatus.NOT_FOUND,
            );
        }
        // if (tag.userId !== userId) {
        //     throw new HttpException(
        //         'You are unauthorized to manage this post',
        //         HttpStatus.UNAUTHORIZED,
        //     );
        // }

        return tag;
    }

    async update(id: number, updateFileTypesDto: UpdateFileTypesDto) {
        const tag = await this.getFindById(id);
        tag.name = updateFileTypesDto.name || tag.name;
        tag.no_of_files = updateFileTypesDto.no_of_files || tag.no_of_files;
        tag.labels = updateFileTypesDto.labels || tag.labels;
        tag.file_validations =
            updateFileTypesDto.file_validations || tag.file_validations;
        tag.file_maxsize = updateFileTypesDto.file_maxsize || tag.file_maxsize;

        return tag.save();
    }

    async delete(id: number) {
        const row = await this.getFindById(id);
        await row.destroy();
        return row;
    }
}
