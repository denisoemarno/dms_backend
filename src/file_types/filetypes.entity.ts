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
import { User } from './../users/user.entity';

@Table({
    tableName: 'file_types',
})
export class Filetypes extends Model<Filetypes> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Length({
        min: 3,
        max: 60,
        msg: `The length of file types name can't be shorter than 3 and longer than 60 `,
    })
    @Column
    name: string;

    @Column(DataType.INTEGER)
    no_of_files: number;

    @Column
    labels: string;

    @Column
    file_validations: string;

    @Column(DataType.INTEGER)
    file_maxsize: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
