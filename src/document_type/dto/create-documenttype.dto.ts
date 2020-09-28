import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsNumber } from 'class-validator';

export class CreateDocumentTypeDto {
    @ApiProperty()
    @IsString()
    @Length(3, 255)
    readonly name: string;

    @ApiProperty()
    @IsNumber()
    readonly workflow_id: number;
}
