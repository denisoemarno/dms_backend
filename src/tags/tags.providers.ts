import { Tags } from './tags.entity';

export const tagsProviders = [{ provide: 'TagsRepository', useValue: Tags }];
