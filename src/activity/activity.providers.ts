import { Activity } from './activity.entity';

export const activityProviders = [
    { provide: 'ActivityRepository', useValue: Activity },
];
