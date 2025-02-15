import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { stringify } from 'querystring';

@Injectable()
export class CourseService {
  constructor(@InjectModel("Course") private courseModel: Model<Course>) {} 

  create(createCourseDto: CreateCourseDto) {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save(); 
  }

  findAll(contains?: string) {
    if(contains)
      return this.courseModel.find({ abbreviation: { $regex: contains, $options: 'i' }}).exec();

    return this.courseModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  async getLectures(abbr: string) {
    const course = await this.courseModel.findOne({ abbreviation: { $eq: abbr }}).exec();
    return course?.lectures;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
