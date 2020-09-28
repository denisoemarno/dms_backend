import {
    Table,
    Column,
    Model,
    Unique,
    IsEmail,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    HasMany,
} from 'sequelize-typescript';
import { Gender } from './../shared/enum/gender';
import { UserRole } from './../shared/enum/roles';
import { Post } from './../posts/post.entity';
import { Documents } from './../documents/document.entity';

@Table({
    tableName: 'user',
})
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Unique
    @IsEmail
    @Column
    email: string;

    @Column
    password: string;

    @Column({ field: 'first_name' })
    firstName: string;

    @Column({ field: 'last_name' })
    lastName: string;

    @Column({ type: DataType.ENUM(Gender.female, Gender.male) })
    gender: Gender;

    @Column(DataType.DATEONLY)
    birthday: string;

    @Column({
        type: DataType.ENUM(
            UserRole.ADMIN,
            UserRole.APPROVAL,
            UserRole.CASTADIAN,
            UserRole.DIRECTOR,
            UserRole.DOCUMENT_OWNER,
            UserRole.DOCUMENT_WRITER,
            UserRole.USER,
        ),
        defaultValue: UserRole.USER,
    })
    role: UserRole;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at' })
    deletedAt: Date;

    @HasMany(() => Post)
    posts: Post[];

    @HasMany(() => Documents, 'created_by')
    creator: Documents[];

    @HasMany(() => Documents, 'verified_by')
    verificator: Documents[];
}
