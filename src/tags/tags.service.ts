import { User } from './../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTagsDto } from './dto/create-tags.dto';
import { Tags } from './tags.entity';
import { TagsDto, TagsPaginateDto } from './dto/tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';
//const Sequelize = require('sequelize');
import { Op } from 'sequelize';
//const Op = Sequelize.Op;
import { Logger } from '@nestjs/common';

@Injectable()
export class TagsService {
    constructor(
        @Inject('TagsRepository')
        private readonly tagsRepository: typeof Tags,
    ) {}

    async findAll(): Promise<TagsDto[]> {
        const tags = await this.tagsRepository.findAll<Tags>({
            include: [User],
        });
        return tags.map(tags => {
            return new TagsDto(tags);
        });
    }

    async findGetAll(
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<TagsPaginateDto> {
        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.tagsRepository.findAndCountAll({
                include: [User],
                where: {
                    name: {
                        [Op.like]: '%' + keyword + '%',
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            return new TagsPaginateDto(data.count, data.rows);
        } else {
            const data = await this.tagsRepository.findAndCountAll({
                include: [User],
                offset: offsetNumber,
                limit: limit,
            });
            Logger.log(data);

            return new TagsPaginateDto(data.count, data.rows);
        }
    }

    async findOne(id: number): Promise<TagsDto> {
        const tags = await this.tagsRepository.findByPk<Tags>(id, {
            include: [User],
        });
        if (!tags) {
            throw new HttpException('No tags found', HttpStatus.NOT_FOUND);
        }

        return new TagsDto(tags);
    }

    async create(userId: string, createTagDto: CreateTagsDto) {
        const tag = new Tags();
        tag.userId = userId;
        tag.name = createTagDto.name;
        tag.color = createTagDto.color;
        return tag.save();
    }

    private async getUserTag(id: number, userId: string) {
        const tag = await this.tagsRepository.findByPk<Tags>(id);
        if (!tag) {
            throw new HttpException('No tag found', HttpStatus.NOT_FOUND);
        }
        if (tag.userId !== userId) {
            throw new HttpException(
                'You are unauthorized to manage this post',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return tag;
    }

    async update(id: number, userId: string, updateTagDto: UpdateTagsDto) {
        const tag = await this.getUserTag(id, userId);
        tag.name = updateTagDto.name || tag.name;
        tag.color = updateTagDto.color || tag.color;
        return tag.save();
    }

    async delete(id: number, userId: string) {
        const post = await this.getUserTag(id, userId);
        await post.destroy();
        return post;
    }
}
