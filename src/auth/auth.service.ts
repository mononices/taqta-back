import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private jwtService : JwtService,
        @InjectModel('User') private userModel : Model<User>
    ) {}

    generateJwt(payload){
        return this.jwtService.sign(payload);
    }

    async signIn(user){
        if(!user) {
            throw new BadRequestException('Expected authentication data');
        }

        const userExists = await this.userModel.findOne({ email: { $eq: user.email } }).exec();

        if(!userExists){
            return this.registerUser(user);
        }
        
        return this.generateJwt({
            sub: userExists.id,
            email: userExists.email
        });
    }

    async registerUser(user: CreateUserDto){
        try{
            const newUser = new this.userModel(user);
            await newUser.save();

            return this.generateJwt({
                sub: newUser.id,
                email: newUser.email
            });
        }
        catch{
            throw new InternalServerErrorException();
        }
    }

    async findUserByEmail(email: string){
        const user = this.userModel.findOne({ email: { $eq: email }}).exec();
        
        if(!user) return null;
        return user;
    }
}