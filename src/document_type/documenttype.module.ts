import { Module } from '@nestjs/common';
import { DatabaseModule } from './../database/database.module';
import { DocumentTypeController } from './documenttype.controller';
import { DocumentTypeService } from './documenttype.service';
import { documentTypeProviders } from './documenttype.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [DocumentTypeController],
    providers: [DocumentTypeService, ...documentTypeProviders],
    exports: [DocumentTypeService],
})
export class DocumentTypeModule {}
