import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsNumber } from 'class-validator';

export class CreateActivityDto {
    @ApiProperty()
    @IsString()
    @Length(3, 255)
    readonly activity: string;

    @ApiProperty()
    @IsNumber()
    readonly documentId: number;
}
