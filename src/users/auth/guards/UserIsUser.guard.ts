import {
    Injectable,
    CanActivate,
    Inject,
    forwardRef,
    ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users.service';
import { User } from '../../user.entity';
import { map } from 'rxjs/operators';

@Injectable()
export class UserIsUserGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: User = request.user;

        return this.userService.findOne(user.id).then(i => {
            let hasPermission = false;

            if (i.id === params.id) {
                hasPermission = true;
            }

            return user && hasPermission;
        });

        // return this.userService.findOne(user.id).pipe(
        //     map((user: User) => {
        //         let hasPermission = false;

        //         if (user.id === params.id) {
        //             hasPermission = true;
        //         }

        //         return user && hasPermission;
        //     }),
        // );
    }
}
