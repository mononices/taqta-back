import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './session.schema';
import { SessionDto } from './dto/session-response.dto';
import { Course } from 'src/course/course.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel("Session") private sessionModel: Model<Session>,
    @InjectModel("Course") private courseModel: Model<Course>
  ) {} 

  async create(createSessionDto: SessionDto) {
    console.log(createSessionDto);
    const createdSession = new this.sessionModel(createSessionDto);
    const course_id = createSessionDto.course_id;
    const savedSession = await createdSession.save();

    if(course_id){
      await this.courseModel.findByIdAndUpdate(course_id, { $push: { sessions: savedSession._id } });
    }

    return savedSession; 
  }

  findAll() {
    return this.sessionModel.find().exec(); 
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
