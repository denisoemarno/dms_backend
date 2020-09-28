import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateApprovalDocumentsDto {
    @ApiProperty()
    @IsString()
    readonly parameter: string;

    @ApiProperty()
    @IsString()
    readonly comment: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly documentNumber: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly category: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly restriction: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly verified_by: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsString()
    // readonly verified_name: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsDate()
    // @Type(() => Date)
    // readonly verified_at: Date;
}
