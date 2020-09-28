import { Documents } from './document.entity';

export const documentsProviders = [
    { provide: 'DocumentsRepository', useValue: Documents },
];
