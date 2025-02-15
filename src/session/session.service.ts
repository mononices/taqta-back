import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './session.schema';

@Injectable()
export class SessionService {
  constructor(@InjectModel("Session") private sessionModel: Model<Session>) {} 

  create(createSessionDto: CreateSessionDto) {
    const createdSession = new this.sessionModel(createSessionDto);
    return createdSession.save(); 
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
