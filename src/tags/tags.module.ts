import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { tagsProviders } from './tags.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [TagsController],
    providers: [TagsService, ...tagsProviders],
    exports: [TagsService],
})
export class TagsModule {}
