import { OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { Posts } from './Posts';
import { Likes } from './Likes';
import { Comments } from './Comments';

@Entity()
export class Users { 

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    email: string

    @Column()
    password: string
    
    @Column({type: 'bool' , default: true})
    isActive: boolean

    @Column({type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    createdDate: Date

    // relationships

    @OneToMany(() => Posts, p => p.user )
    posts: Posts

    @OneToMany(() => Likes, l => l.user )
    likes: Likes

    @OneToMany(() => Comments, c => c.user )
    comments: Comments

}