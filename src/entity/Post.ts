import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Post {

    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column({type: 'bool'})
    active: boolean

}
