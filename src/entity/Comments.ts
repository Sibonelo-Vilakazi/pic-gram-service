import { JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { Users } from './Users';
import { Posts } from './Posts';


@Entity()
export class Comments{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string
    
    @Column()
    postId: string
    
    @Column()
    commentText: string

    @Column({type: 'bool', default: true})
    isActive: boolean

    @Column({type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    createdDate: Date 

    @ManyToOne(() => Users, {eager: true})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: Users

    @ManyToOne(() => Posts, {eager: true})
    @JoinColumn({name: 'post_id', referencedColumnName: 'id'})
    post: Posts

}