import { FiletypesService } from './filetypes.service';
import { FiletypesController } from './filetypes.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './../database/database.module';
import { fileTypesProviders } from './filetypes.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [FiletypesController],
    providers: [FiletypesService, ...fileTypesProviders],
    exports: [FiletypesService],
})
export class FiletypesModule {}
