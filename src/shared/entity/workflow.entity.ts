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
    tableName: 'workflow',
    timestamps: false,
})
export class Workflow extends Model<Workflow> {
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
}
