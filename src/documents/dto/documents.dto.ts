import { ApiProperty } from '@nestjs/swagger';
import { Documents } from '../document.entity';
import { Tags } from '../../tags/tags.entity';
import { Logger } from '@nestjs/common';
import { Files } from 'src/shared/entity/files.entity';

export class DocumentsDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly type: number;

    @ApiProperty()
    readonly typeName: string;

    @ApiProperty()
    readonly documentNumber: string;

    @ApiProperty()
    readonly category: string;

    @ApiProperty()
    readonly restriction: string;

    @ApiProperty()
    readonly status: string;

    @ApiProperty()
    readonly createdBy: string;

    @ApiProperty()
    readonly createdName: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly writerId: string;

    @ApiProperty()
    readonly writerName: string;

    @ApiProperty()
    readonly writerAt: Date;

    @ApiProperty()
    readonly verifiedId: string;

    @ApiProperty()
    readonly verifiedName: string;

    @ApiProperty()
    readonly verifiedAt: Date;

    @ApiProperty()
    readonly publishId: string;

    @ApiProperty()
    readonly publishName: string;

    @ApiProperty()
    readonly publishAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    @ApiProperty()
    readonly dueDate: Date;

    @ApiProperty()
    readonly frequency: string;

    @ApiProperty()
    readonly tags: Tags[];

    @ApiProperty()
    readonly files: Files[];

    constructor(doc: Documents) {
        this.id = doc.id;
        this.name = doc.name;
        this.title = doc.title;
        this.description = doc.description;
        this.type = doc.type;
        this.typeName = doc.documentType.name;
        this.documentNumber = doc.document_number;
        this.category = doc.category;
        this.restriction = doc.restriction;
        this.status = doc.status;
        this.createdBy = doc.createdBy;
        this.createdName = doc.created_name;
        this.createdAt = doc.createdAt;
        // this.writerId = doc.writerBy;
        // this.writerName = doc.writer_name;
        // this.writerAt = doc.writerDate;
        // this.verifiedId = doc.verifiedBy;
        // this.verifiedName = doc.verified_name;
        // this.verifiedAt = doc.verifiedDate;
        // this.publishId = doc.publishBy;
        // this.publishName = doc.publish_name;
        // this.publishAt = doc.publishDate;
        this.updatedAt = doc.updatedAt;
        this.dueDate = doc.dueDate;
        this.frequency = doc.frequency;
        this.tags = doc.tags;
        this.files = doc.files;
    }
}

export class DocumentsPaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: DocumentsDto[];

    constructor(totalCount: number, data: any) {
        this.totalCount = totalCount;
        this.rows = data.map(i => {
            return new DocumentsDto(i);
        });
    }
}
