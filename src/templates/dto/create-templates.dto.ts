import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional } from 'class-validator';

export class CreateTemplatesDto {
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    name: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    template?: string;
}
