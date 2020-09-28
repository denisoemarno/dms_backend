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

@Table({
    tableName: 'documents_tag',
    timestamps: false,
})
export class DocumentTag extends Model<DocumentTag> {
    @ForeignKey(() => Documents)
    @Column({
        field: 'document_id',
    })
    documentId: number;

    @ForeignKey(() => Tags)
    @Column({
        field: 'tag_id',
    })
    tagId: number;
}
