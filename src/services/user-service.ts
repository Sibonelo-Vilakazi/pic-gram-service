import { QueryRunner, Repository } from "typeorm"
import { User } from "../entity/Users"


export class UserService { 

    private userRepository: Repository<User> = null; 

    constructor(private queryRunner: QueryRunner){ 
        this.userRepository = this.queryRunner.manager.getRepository(User);
    }


    async getUsers() {
        return this.userRepository.find()
    }

    async getUserById(userId: number) {
       
        const user = await this.userRepository.findOne({
            where: { 
                id: userId 
            }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async createUser(userData: { firstName, lastName, age }) {
        const { firstName, lastName, age } = userData;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age
        })

        return this.userRepository.save(user)
    }

    async remove(id: number) {
        
        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }


}