import { DocumentType } from './documenttype.entity';

export const documentTypeProviders = [
    { provide: 'DocumenttypeRepository', useValue: DocumentType },
];
