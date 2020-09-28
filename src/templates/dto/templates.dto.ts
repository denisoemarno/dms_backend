import { ApiProperty } from '@nestjs/swagger';
import { Template } from '../templates.entity';

export class TemplatesDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly userId: string;

    @ApiProperty()
    readonly userFirstName: string;

    @ApiProperty()
    readonly userLastName: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly template: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    @ApiProperty()
    readonly deletedAd: Date;

    constructor(template: Template) {
        this.id = template.id;
        this.userId = template.userId;
        this.userFirstName = template.user.firstName;
        this.userLastName = template.user.lastName;
        this.name = template.name;
        this.template = template.template;
        this.createdAt = template.createdAt;
        this.updatedAt = template.updatedAt;
    }
}

export class TemplatesPaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: TemplatesDto[];

    constructor(totalCount: number, data: any) {
        this.totalCount = totalCount;
        this.rows = data.map(i => {
            return new TemplatesDto(i);
        });
    }
}
