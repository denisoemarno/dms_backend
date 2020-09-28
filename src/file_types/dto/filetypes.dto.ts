import { ApiProperty } from '@nestjs/swagger';
import { Filetypes } from '../filetypes.entity';

export class FileTypesDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly no_of_files: number;

    @ApiProperty()
    readonly labels: string;

    @ApiProperty()
    readonly file_validations: string;

    @ApiProperty()
    readonly file_maxsize: number;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(fileType: Filetypes) {
        this.id = fileType.id;
        this.name = fileType.name;
        this.no_of_files = fileType.no_of_files;
        this.labels = fileType.labels;
        this.file_validations = fileType.file_validations;
        this.file_maxsize = fileType.file_maxsize;
        this.createdAt = fileType.createdAt;
        this.updatedAt = fileType.updatedAt;
    }
}

export class FiletypesPaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: FileTypesDto[];

    constructor(totalCount: number, data: any) {
        this.totalCount = totalCount;
        this.rows = data;
    }
}
