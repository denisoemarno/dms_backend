import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentTag } from '../../shared/entity/documentTag.entity';

export class UpdateApprovalS4DocumentsDto {
    @ApiProperty()
    @IsString()
    readonly parameter: string;

    @ApiProperty()
    @IsArray()
    readonly tags: DocumentTag[];
}
