import { ConflictException, InternalServerErrorException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginDto } from "src/dto/login.dto";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm"

export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }

    async createUser(userData: LoginDto) {
        this.userRepository.create(userData);
        try {
            return await this.userRepository.save(userData);    
        } catch (error) {
            if (error.code === '23505') {
                // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
        
    }
}