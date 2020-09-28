import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDocumentTypeDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly name?: string;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    readonly workflow_id?: number;
}
