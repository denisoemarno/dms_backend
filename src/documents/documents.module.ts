import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Module } from '@nestjs/common';
import { documentsProviders } from './documents.providers';
import { DatabaseModule } from './../database/database.module';
import { workFlowStatusProviders } from './workflowStatus.providers';
import { workFlowFlowProviders } from './workflowFlow.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [DocumentsController],
    providers: [
        DocumentsService,
        ...documentsProviders,
        ...workFlowStatusProviders,
        ...workFlowFlowProviders,
    ],
})
export class DocumentsModule {}
