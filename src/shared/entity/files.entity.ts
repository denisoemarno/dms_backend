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
    tableName: 'files',
    timestamps: false,
})
export class Files extends Model<Files> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column
    name: string;

    @Column
    file: string;

    @ForeignKey(() => Documents)
    @Column({
        field: 'document_id',
    })
    documentId: number;

    @Column({
        type: DataType.INTEGER,
        field: 'file_type_id',
    })
    file_tipe_id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        field: 'created_by',
    })
    userId: string;
}
