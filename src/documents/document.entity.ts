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
    BelongsToMany,
    AllowNull,
    HasMany,
} from 'sequelize-typescript';

// IMPORT ENTITY
import { Tags } from './../tags/tags.entity';
import { User } from './../users/user.entity';
import { DocumentType } from './../document_type/documenttype.entity';
import { DocumentTag } from '../shared/entity/documentTag.entity';
import { Files } from '../shared/entity/files.entity';

@Table({
    tableName: 'documents',
})
export class Documents extends Model<Documents> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Length({
        min: 3,
        max: 60,
        msg: `The length of file types name can't be shorter than 3 and longer than 60 `,
    })
    @Column
    name: string;

    @Column
    title: string;

    @Column
    description: string;

    @ForeignKey(() => DocumentType)
    @Column({
        type: DataType.NUMBER,
        field: 'type',
    })
    type: number;

    @Column
    document_number: string;

    @Column
    category: string;

    @Column
    restriction: string;

    @Column
    status: string;

    @Column({
        type: DataType.UUID,
        field: 'created_by',
    })
    createdBy: string;

    @Column
    created_name: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @Column({
        type: DataType.UUID,
        field: 'writer_by',
    })
    writerBy: string;

    @Column
    writer_name: string;

    @Column({
        type: DataType.DATE,
        field: 'writer_at',
    })
    writerDate: Date;

    @Column({
        type: DataType.UUID,
        field: 'verified_by',
    })
    verifiedBy: string;

    @Column
    verified_name: string;

    @Column({
        type: DataType.DATE,
        field: 'verified_at',
    })
    verifiedDate: Date;

    @Column({
        type: DataType.UUID,
        field: 'publish_by',
    })
    publishBy: string;

    @Column
    publish_name: string;

    @Column({
        type: DataType.DATE,
        field: 'publish_at',
    })
    publishDate: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @Column({
        type: DataType.DATE,
        field: 'due_date',
    })
    dueDate: Date;

    @Column
    frequency: string;

    @BelongsToMany(
        () => Tags,
        () => DocumentTag,
    )
    tags: Tags[];

    @BelongsTo(() => DocumentType)
    documentType: DocumentType;

    @HasMany(() => Files)
    files: Files[];

    // @BelongsTo(() => User)
    // user: User;

    // @BelongsTo(() => User, {
    //     foreignKey: {
    //         name: 'created_by',
    //         allowNull: false,
    //     },
    // })
    // user: User;

    // @BelongsTo(() => User, {
    //     foreignKey: {
    //         name: 'verified_by',
    //         allowNull: true,
    //     },
    // })
    // userVerified: User;

    //tags: Array<Tags & { DocumentTag: DocumentTag }>;
}
