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

@Table({
    tableName: 'tags',
})
export class Tags extends Model<Tags> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: 'user_id',
    })
    userId: string;

    @Length({
        min: 3,
        max: 60,
        msg: `The length of post title can't be shorter than 3 and longer than 60 `,
    })
    @Column
    name: string;

    @Column
    color: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at' })
    deletedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(
        () => Documents,
        () => DocumentTag,
    )
    documents: Documents[];
}
