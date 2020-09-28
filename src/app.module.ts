import { DocumentTypeModule } from './document_type/documenttype.module';
import { ActivityModule } from './activity/activity.module';
import { TemplatesModule } from './templates/templates.module';
import { DocumentsModule } from './documents/documents.module';
import { FiletypesModule } from './file_types/filetypes.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';

@Module({
    imports: [
        DocumentTypeModule,
        ActivityModule,
        TemplatesModule,
        DocumentsModule,
        FiletypesModule,
        TagsModule,
        UsersModule,
        PostsModule,
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
