import { JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { Users } from './Users';

@Entity()
export class Posts{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string
    
    @Column()
    imageUrl: string

    @Column()
    caption: string

    @Column({type: 'bool', default: true})
    isActive: boolean

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdDate: Date

    // relationships 
    @ManyToOne(() => Users, {eager: true})  
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: Users

    
}   