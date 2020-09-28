import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { User } from './../users/user.entity';
import { CreateTemplatesDto } from './dto/create-templates.dto';
import { Template } from './templates.entity';
import { TemplatesDto, TemplatesPaginateDto } from './dto/templates.dto';
import { UpdateTemplatesDto } from './dto/update-templates.dto';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

@Injectable()
export class TemplatesService {
    constructor(
        @Inject('TemplatesRepository')
        private readonly templatesRepository: typeof Template,
    ) {}

    async findAll(): Promise<TemplatesDto[]> {
        const templates = await this.templatesRepository.findAll<Template>({
            include: [User],
        });
        return templates.map(template => {
            return new TemplatesDto(template);
        });
    }

    async findGetAll(
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<TemplatesPaginateDto> {
        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.templatesRepository.findAndCountAll({
                include: [User],
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            return new TemplatesPaginateDto(data.count, data.rows);
        } else {
            const data = await this.templatesRepository.findAndCountAll({
                include: [User],
                offset: offsetNumber,
                limit: limit,
            });
            Logger.log(data);

            return new TemplatesPaginateDto(data.count, data.rows);
        }
    }

    async findOne(id: number): Promise<TemplatesDto> {
        const tags = await this.templatesRepository.findByPk<Template>(id, {
            include: [User],
        });
        if (!tags) {
            throw new HttpException('No templates found', HttpStatus.NOT_FOUND);
        }

        return new TemplatesDto(tags);
    }

    async create(
        userId: string,
        filename: string,
        createTemplateDto: CreateTemplatesDto,
    ) {
        const template = new Template();
        template.userId = userId;
        template.name = createTemplateDto.name;
        template.template = filename;
        return template.save();
    }

    private async getUserTemplate(id: number, userId: string) {
        const tag = await this.templatesRepository.findByPk<Template>(id);
        if (!tag) {
            throw new HttpException('No templates found', HttpStatus.NOT_FOUND);
        }
        if (tag.userId !== userId) {
            throw new HttpException(
                'You are unauthorized to manage this templates',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return tag;
    }

    async update(
        id: number,
        userId: string,
        updateTemplatesDto: UpdateTemplatesDto,
    ) {
        const template = await this.getUserTemplate(id, userId);
        template.name = updateTemplatesDto.name || template.name;
        template.template = updateTemplatesDto.template || template.template;
        return template.save();
    }

    async delete(id: number, userId: string) {
        const template = await this.getUserTemplate(id, userId);
        await template.destroy();
        return template;
    }
}
