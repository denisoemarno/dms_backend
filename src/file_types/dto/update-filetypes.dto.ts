import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateFileTypesDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly name?: string;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    readonly no_of_files?: number;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly labels?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly file_validations?: string;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    readonly file_maxsize?: number;
}
