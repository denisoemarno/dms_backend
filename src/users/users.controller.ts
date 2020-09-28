import { UserLoginRequestDto } from './dto/user-login-request.dto';
import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    Delete,
    Req,
    UseGuards,
    Put,
    ParseIntPipe,
    Param,
    Query,
    DefaultValuePipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto, UserPaginateDto } from './dto/user.dto';
import {
    ApiTags,
    ApiOkResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from './user.entity';
import { hasRoles } from './auth/decorators/roles.decorators';
import { UserRole } from './../shared/enum/roles';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserIsUserGuard } from './auth/guards/UserIsUser.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @hasRoles(UserRole.ADMIN)
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('register')
    @ApiOkResponse({ type: UserLoginResponseDto })
    register(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserLoginResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOkResponse({ type: UserLoginResponseDto })
    login(
        @Body() userLoginRequestDto: UserLoginRequestDto,
    ): Promise<UserLoginResponseDto> {
        return this.usersService.login(userLoginRequestDto);
    }

    // @Get()
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // @ApiOkResponse({ type: [UserDto] })
    // findAll(): Promise<UserDto[]> {
    //     return this.usersService.findAll();
    // }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserDto })
    async getUser(@Req() request): Promise<UserDto> {
        return this.usersService.getUser(request.user.id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({ type: UserDto })
    @ApiParam({ name: 'id', required: true })
    update(
        @Body() updateUserDto: UpdateUserDto,
        // @Req() request,
        @Param('id') id: string,
    ): Promise<UserDto> {
        return this.usersService.update(id, updateUserDto);
    }

    @Put('update-profile/me')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), UserIsUserGuard)
    @ApiOkResponse({ type: UserDto })
    //@ApiParam({ name: 'id', required: true })
    updateProfile(
        @Body() updateUserDto: UpdateUserDto,
        @Req() request,
        // @Param('id') id: string,
    ): Promise<UserDto> {
        return this.usersService.update(request.user.id, updateUserDto);
    }

    // @Delete('me')
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    // @ApiOkResponse({ type: UserDto })
    // delete(@Req() request): Promise<UserDto> {
    //     return this.usersService.delete(request.user.id);
    // }

    @Delete(':id')
    @ApiOkResponse({ type: UserDto })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    delete(@Param('id') id: string): Promise<UserDto> {
        return this.usersService.delete(id);
    }

    @Get('')
    @ApiOkResponse({ type: [UserDto] })
    @ApiQuery({
        name: 'q',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'offset',
        required: true,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: true,
        type: Number,
    })
    getAllUsers(
        @Query('q') keyword?: string,
        @Query('limit', new DefaultValuePipe(10), new ParseIntPipe())
        limit?: number,
        @Query('offset', new DefaultValuePipe(0), new ParseIntPipe())
        offset?: number,
    ): Promise<UserPaginateDto> {
        return this.usersService.findGetAll(keyword, offset, limit);
    }

    @Get('/all')
    @ApiOkResponse({ type: [UserDto] })
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }
}
