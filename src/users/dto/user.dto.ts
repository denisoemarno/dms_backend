import { User } from './../user.entity';
import { Gender } from './../../shared/enum/gender';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './../../shared/enum/roles';

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly firstName: string;

    @ApiProperty()
    readonly lastName: string;

    @ApiProperty()
    readonly gender: Gender;

    @ApiProperty()
    readonly birthday: string;

    @ApiProperty()
    readonly role: UserRole;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.gender = user.gender;
        this.birthday = user.birthday;
        this.role = user.role;
    }
}

export class UserPaginateDto {
    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    readonly rows: UserDto[];

    constructor(totalCount: number, data: any) {
        this.totalCount = totalCount;
        this.rows = data;
    }
}
