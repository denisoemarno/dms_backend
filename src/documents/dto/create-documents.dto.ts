import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsArray, IsNumber } from 'class-validator';
// import { TagsDto } from '../../tags/dto/tags.dto';
import { DocumentTag } from '../../shared/entity/documentTag.entity';

export class CreateDocumentsDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly title: string;

    @ApiProperty()
    @IsString()
    readonly description: string;

    @ApiProperty()
    @IsNumber()
    readonly type: number;

    @ApiProperty()
    @IsString()
    readonly parameter: string;

    // @ApiProperty()
    // @IsString()
    // readonly writerBy: string;

    // @ApiProperty()
    // @IsString()
    // readonly writerName: string;

    // @ApiProperty()
    // @IsString()
    // readonly verifiedBy: string;

    // @ApiProperty()
    // @IsString()
    // readonly verifiedName: string;

    // @ApiProperty()
    // @IsArray()
    // readonly tags: DocumentTag[];
}
