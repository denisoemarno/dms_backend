import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users.service';
import { Observable } from 'rxjs';
import { User } from '../../user.entity';
import { map } from 'rxjs/operators';
import { hasRoles } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        console.log(request.user);
        const user: User = request.user;

        return this.userService.findOne(user.id).then(i => {
            const hasRole = () => roles.indexOf(user.role) > -1;
            let hasPermission: boolean = false;
            if (hasRole()) {
                hasPermission = true;
            }
            return user && hasPermission;
            return true;
        });
    }
}
