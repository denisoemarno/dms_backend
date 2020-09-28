import { ApiProperty } from '@nestjs/swagger';
import { Tags } from '../tags.entity';

export class TagsDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly authorId: string;

    @ApiProperty()
    readonly authorFirstName: string;

    @ApiProperty()
    readonly authorLastName: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly color: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(tag: Tags) {
        this.id = tag.id;
        this.authorId = tag.userId;
        this.authorFirstName = tag.user.firstName;
        this.authorLastName = tag.user.lastName;
        this.name = tag.name;
        this.color = tag.color;
        this.createdAt = tag.createdAt;
        this.updatedAt = tag.updatedAt;
    }
}

export class TagsPaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: TagsDto[];

    constructor(totalCount: number, data: any) {
        this.totalCount = totalCount;
        this.rows = data.map(tags => {
            return new TagsDto(tags);
        });
    }
}
