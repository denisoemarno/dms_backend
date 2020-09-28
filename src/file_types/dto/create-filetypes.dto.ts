import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsNumber } from 'class-validator';

export class CreateFileTypesDto {
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @ApiProperty()
    @IsNumber()
    readonly no_of_files: number;

    @ApiProperty()
    @IsString()
    readonly labels: string;

    @ApiProperty()
    @IsString()
    readonly file_validations: string;

    @ApiProperty()
    @IsNumber()
    readonly file_maxsize: number;
}
