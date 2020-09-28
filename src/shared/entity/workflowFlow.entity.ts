import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    Model,
    ForeignKey,
    Unique,
    Length,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    BelongsTo,
} from 'sequelize-typescript';
import { Documents } from '../../documents/document.entity';
import { Tags } from '../../tags/tags.entity';
import { DATE } from 'sequelize';
import { User } from '../../users/user.entity';
import { Workflow } from './workflow.entity';
import { WorkflowStatus } from './workflowStatus.entity';

@Table({
    tableName: 'workflow_flow',
    //timestamps: false,
})
export class WorkflowFlow extends Model<WorkflowFlow> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Workflow)
    @Column({
        type: DataType.NUMBER,
        field: 'workflow_id',
    })
    workflowId: number;

    @ForeignKey(() => WorkflowStatus)
    @Column({
        type: DataType.STRING,
        field: 'workflow_status',
    })
    workflowStatus: string;

    @Length({
        min: 3,
        max: 30,
        msg: `The length of parameter can't be shorter than 3 and longer than 30 `,
    })
    @Column
    parameter: string;

    @ForeignKey(() => WorkflowStatus)
    @Column({
        type: DataType.STRING,
        field: 'next_workflow_status',
    })
    nextWorkflowStatus: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: 'created_by',
    })
    userId: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;
}
