import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { TagsDto } from '../../tags/dto/tags.dto';
import { Type } from 'class-transformer';

export class UpdateDocumentsDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly description: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly status: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly verified_by: string;

    @IsOptional()
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    readonly verified_at: Date;

    @IsOptional()
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    readonly update_at: Date;

    @IsOptional()
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    readonly due_date: Date;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    readonly tags: TagsDto[];
}
