import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from './../shared/config/config.service';

// IMPORT ENTITY
import { User } from './../users/user.entity';
import { Post } from './../posts/post.entity';
import { Tags } from './../tags/tags.entity';
import { Filetypes } from './../file_types/filetypes.entity';
import { Documents } from './../documents/document.entity';
import { DocumentTag } from '../shared/entity/documentTag.entity';
import { Template } from './../templates/templates.entity';
import { Activity } from './../activity/activity.entity';
import { DocumentType } from './../document_type/documenttype.entity';

import { Workflow } from '../shared/entity/workflow.entity';
import { WorkflowStatus } from '../shared/entity/workflowStatus.entity';
import { WorkflowFlow } from '../shared/entity/workflowFlow.entity';
import { Files } from '../shared/entity/files.entity';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize(configService.sequelizeOrmConfig);
            sequelize.addModels([
                Template,
                DocumentTag,
                Documents,
                Tags,
                User,
                Post,
                Filetypes,
                Activity,
                DocumentType,
                Workflow,
                WorkflowStatus,
                WorkflowFlow,
                Files,
            ]);
            //await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
