import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '../activity.entity';

export class ActivityDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly createdId: string;

    @ApiProperty()
    readonly createdName: string;

    @ApiProperty()
    readonly createdLastName: string;

    @ApiProperty()
    readonly documentId: number;

    @ApiProperty()
    readonly activity: string;

    @ApiProperty()
    readonly comment: string;

    @ApiProperty()
    readonly beforeStatus: string;

    @ApiProperty()
    readonly afterStatus: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(activity: Activity) {
        this.id = activity.id;
        this.createdId = activity.userId;
        this.createdName = activity.created_name;
        this.createdLastName = activity.user.lastName;
        this.activity = activity.activity;
        this.comment = activity.comment;
        this.beforeStatus = activity.before_status;
        this.afterStatus = activity.after_status;
        this.documentId = activity.document.id;
        this.createdAt = activity.createdAt;
        this.updatedAt = activity.updatedAt;
    }
}

export class ActivityPaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: ActivityDto[];

    constructor(totalCount: number, datas: any) {
        this.totalCount = totalCount;
        this.rows = datas.map(data => {
            return new ActivityDto(data);
        });
    }
}
