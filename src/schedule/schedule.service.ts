import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleListDto } from './dto/create-schedule-list.dto';
import { Schedule } from './schedule.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { GenerateDto } from './dto/generate-schedule-dto';
import { Course, CourseDocument } from 'src/course/course.schema';
import { CourseDto, CourseResponseDto } from 'src/course/dto/course-response.dto';
import { Throttle } from '@nestjs/throttler';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';

@Injectable()
export class ScheduleService {
 
  constructor(@InjectModel("Schedule") private scheduleModel: Model<Schedule>, 
              @InjectModel("User") private userModel: Model<User>,
              @InjectQueue('generator') private queue: Queue){}

  create(createScheduleDto: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  findAll() {
    return this.scheduleModel.find().populate('sessions').exec();
  }

  findOne(id: string) {
    return this.scheduleModel.findById(id).populate('sessions').exec();
  }

  async save(scheduleListDto: ScheduleListDto, uid: string){
    const operations = scheduleListDto.schedules.map(async (schedule) => {
        if(schedule._id){
          return await this.scheduleModel.findByIdAndUpdate(schedule._id, schedule, { new: true, runValidators: true });
        }
        
        const scheduleDocument = new this.scheduleModel(schedule);
        const updatedUser = await this.userModel.findByIdAndUpdate(uid, { $push: { schedules: scheduleDocument._id } }, { new: true } );

        return await scheduleDocument.save();
    });

    return Promise.all(operations);
  }
  
  async generate(generateDto: GenerateDto, uid: string) {
    const { id } = generateDto;
    const user = await this.userModel.findById(uid).populate('schedules').populate({
      path: 'schedules',
      populate: { path: 'courses.body', populate: {path: 'sessions'}}
    }).exec();

    if(!user) throw new NotFoundException();
    const schedule: Schedule | undefined = user.schedules.at(id);
    if(!schedule) throw new NotFoundException();
    const courses: Course[] = schedule.courses.map((course) => course.body).filter(course => course !== null);
    const courseDtos: CourseDto[] = courses.map((course) => CourseDto.fromDocument(course));
    
    console.log(generateDto.id);
    console.log(courseDtos);
    const job = await this.queue.add('generate', { uid: uid, schedule: generateDto.id, courses: courseDtos, options: generateDto.options })
    return job.id;
  }
  
  async getJobStatus(uid: string, jobId: string){
    const job = await Job.fromId(this.queue, jobId);
    if(!job) throw new NotFoundException();

    const status = await job.getState();
    const result = job.returnvalue;

    return { status: status, result: result };
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
