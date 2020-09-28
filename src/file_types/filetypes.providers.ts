import { Filetypes } from './filetypes.entity';

export const fileTypesProviders = [
    { provide: 'FiletypesRepository', useValue: Filetypes },
];
