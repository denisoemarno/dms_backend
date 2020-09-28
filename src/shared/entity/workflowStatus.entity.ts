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

@Table({
    tableName: 'workflow_status',
    //timestamps: false,
})
export class WorkflowStatus extends Model<WorkflowStatus> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: 'created_by',
    })
    userId: string;

    @Length({
        min: 3,
        max: 60,
        msg: `The length of status can't be shorter than 3 and longer than 60 `,
    })
    @Column
    status: string;

    @Column
    before_status: string;

    @Column
    after_status: string;

    @Column
    type: string;

    @Column
    role: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;
}
