import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Module } from '@nestjs/common';
import { activityProviders } from './activity.providers';

@Module({
    imports: [],
    controllers: [ActivityController],
    providers: [ActivityService, ...activityProviders],
    exports: [ActivityService],
})
export class ActivityModule {}
