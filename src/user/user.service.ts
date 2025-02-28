import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { ScheduleListResponseDto } from 'src/schedule/dto/schedule-list-response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>){}

  async getSchedules(id: string) {
    const schedules = await this.userModel.findById(id).select('schedules').populate('schedules').populate({
      path: 'schedules',
      populate: { path: 'courses.body', populate: {path: 'sessions'} }
    }).exec();

    return plainToInstance(ScheduleListResponseDto, schedules, {excludeExtraneousValues: true, enableCircularCheck: true});
  }

  async getRole(id: string){
    const user = await this.userModel.findById(id).select('role').exec();
    return user?.role;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userModel.find().populate('schedules').exec(); 
  }

  findOne(id: string) {
    return this.userModel.findById(id).populate('schedules').exec(); 
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
