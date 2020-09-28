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

@Table({
    tableName: 'activities',
})
export class Activity extends Model<Activity> {
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

    @Column
    created_name: string;

    @ForeignKey(() => Documents)
    @Column({
        type: DataType.INTEGER,
        field: 'document_id',
    })
    documentId: number;

    @Length({
        min: 3,
        max: 255,
        msg: `The length of post title can't be shorter than 3 and longer than 255 `,
    })
    @Column
    activity: string;

    @Column
    comment: string;

    @Column
    before_status: string;

    @Column
    after_status: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Documents)
    document: Documents;
}
