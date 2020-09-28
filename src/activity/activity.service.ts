import { User } from './../users/user.entity';
import { Documents } from './../documents/document.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './activity.entity';
import { ActivityDto, ActivityPaginateDto } from './dto/activity.dto';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import { Logger } from '@nestjs/common';

@Injectable()
export class ActivityService {
    constructor(
        @Inject('ActivityRepository')
        private readonly activityRepository: typeof Activity,
    ) {}

    async findAll(): Promise<ActivityDto[]> {
        const tags = await this.activityRepository.findAll<Activity>({
            include: [User, Documents],
        });
        return tags.map(tags => {
            return new ActivityDto(tags);
        });
    }

    async findGetAll(
        keyword?: string,
        offset = 0,
        limit = 10,
    ): Promise<ActivityPaginateDto> {
        let offsetNumber = 0 + (offset - 1) * limit;
        if (keyword) {
            const data = await this.activityRepository.findAndCountAll({
                include: [User, Documents],
                where: {
                    activity: {
                        [Op.like]: '%' + keyword + '%',
                    },
                },
                offset: offsetNumber,
                limit: limit,
            });
            return new ActivityPaginateDto(data.count, data.rows);
        } else {
            const data = await this.activityRepository.findAndCountAll({
                include: [User, Documents],
                offset: offsetNumber,
                limit: limit,
            });
            Logger.log(data);

            return new ActivityPaginateDto(data.count, data.rows);
        }
    }

    async findOne(id: number): Promise<ActivityDto> {
        const activity = await this.activityRepository.findByPk<Activity>(id, {
            include: [User, Documents],
        });
        if (!activity) {
            throw new HttpException('No activity found', HttpStatus.NOT_FOUND);
        }

        return new ActivityDto(activity);
    }

    async findByDocId(docId: number): Promise<ActivityDto[]> {
        const tags = await this.activityRepository.findAll<Activity>({
            include: [User, Documents],
            where: {
                document_id: docId,
            },
        });
        return tags.map(tags => {
            return new ActivityDto(tags);
        });
    }

    private async getUserActivity(id: number, userId: string) {
        const tag = await this.activityRepository.findByPk<Activity>(id);
        if (!tag) {
            throw new HttpException('No activity found', HttpStatus.NOT_FOUND);
        }
        if (tag.userId !== userId) {
            throw new HttpException(
                'You are unauthorized to manage this activity',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return tag;
    }

    async create(userId: string, firstName: string, createActivity: CreateActivityDto) {
        const activity = new Activity();
        activity.userId = userId;
        activity.created_name = firstName;
        activity.documentId = createActivity.documentId;
        activity.activity = createActivity.activity;
        return activity.save();
    }

    async delete(id: number, userId: string) {
        const data = await this.getUserActivity(id, userId);
        await data.destroy();
        return data;
    }
}
