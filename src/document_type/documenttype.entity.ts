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
    Association,
    BelongsToMany,
} from 'sequelize-typescript';
import { User } from './../users/user.entity';
import { Documents } from './../documents/document.entity';
import { DocumentTag } from './../shared/entity/documentTag.entity';
import { Workflow } from './../shared/entity/workflow.entity';

@Table({
    tableName: 'document_type',
})
export class DocumentType extends Model<DocumentType> {
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
        max: 255,
        msg: `The length of post title can't be shorter than 3 and longer than 255 `,
    })
    @Column
    name: string;

    @ForeignKey(() => Workflow)
    @Column
    workflow_id: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Workflow)
    wokflow: Workflow;
}
