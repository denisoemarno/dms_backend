import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../documenttype.entity';

export class DocumentTypeDto {
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
    readonly workflow_id: number;

    @ApiProperty()
    readonly workflow_name: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(data: DocumentType) {
        this.id = data.id;
        this.userId = data.userId;
        this.userFirstName = data.user.firstName;
        this.userLastName = data.user.lastName;
        this.name = data.name;
        this.workflow_id = data.workflow_id;
        this.workflow_name = data.wokflow.name;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export class DocumentTypePaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: DocumentTypeDto[];

    constructor(totalCount: number, data: any) {
        this.totalCount = totalCount;
        this.rows = data.map(tags => {
            return new DocumentTypeDto(tags);
        });
    }
}
