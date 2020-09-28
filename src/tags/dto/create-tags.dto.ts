import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString } from 'class-validator';

export class CreateTagsDto {
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly color: string;
}
