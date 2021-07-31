import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity('token')
export class TokenEntity extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(type => UserEntity, (user) => user.id,  { cascade: true, onDelete: 'CASCADE' })
    user: string;

    @Column({type: 'varchar', length: 100, unique: true})
    tokenId: string

    @Column({type: 'integer'})
    iat: number;
    
    @Column({type: 'integer'})
    exp: number

    @Column({type: 'boolean', default: false})
    isBlackListed?: boolean

}