import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { DatabaseModule } from './../database/database.module';
import { UsersService } from './users.service';
import { JwtStrategy } from './auth/jwt-strategy';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserIsUserGuard } from './auth/guards/UserIsUser.guard';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        ...usersProviders,
        JwtStrategy,
        RolesGuard,
        UserIsUserGuard,
    ],
    exports: [UsersService],
})
export class UsersModule {}
