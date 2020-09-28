import { Template } from './templates.entity';

export const templatesProviders = [
    { provide: 'TemplatesRepository', useValue: Template },
];
