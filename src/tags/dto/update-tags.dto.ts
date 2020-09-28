import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional } from 'class-validator';

export class UpdateTagsDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly name?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly color?: string;
}
