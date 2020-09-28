import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { Module } from '@nestjs/common';
import { templatesProviders } from './templates.providers';

@Module({
    imports: [],
    controllers: [TemplatesController],
    providers: [TemplatesService, ...templatesProviders],
    exports: [TemplatesService],
})
export class TemplatesModule {}
