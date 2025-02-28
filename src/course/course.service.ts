import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './course.schema';
import { stringify } from 'querystring';
import { CourseResponseDto } from './dto/course-response.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel("Course") private courseModel: Model<Course>) {} 

  async create(createCourseDto: CreateCourseDto) {
    console.log(createCourseDto);
    const createdCourse = new this.courseModel(createCourseDto);
    console.log(createdCourse);
    return await createdCourse.save(); 
  }

  async findAll(contains?: string, degree?: string, semester?: string) : Promise<CourseResponseDto[]>{
    if(!contains) contains = "";
    if(!degree) degree = "";
    let query = this.courseModel.find({ abbreviation: { $regex: contains, $options: 'i' }, level: { $regex: degree, $options: 'i' }});
    if(semester){
      const [termString, yearString] = semester.split(' ');
      const year = Number(yearString);
      const term = termString.toLowerCase();

      let start = new Date();
      let end = new Date();
      
      if(term == 'spring'){
        start = new Date(year, 0, 1);
        end = new Date(year, 4, 31);
      }
      else if(term == 'summer'){
        start = new Date(year, 5, 1);
        end = new Date(year, 6, 31)
      }
      else if(term == 'fall'){
        start = new Date(year, 7, 1);
        end = new Date(year, 11, 31);
      }
      
      query = query.find({ start_date: { $gte: start, $lte: end } });
    }

    query = query.populate('sessions');
    const docs: CourseDocument[] = await query.exec();
    const dtos = docs.map((doc) => CourseResponseDto.fromDocument(doc));
    return dtos; 
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  async getLectures(abbr: string) {
    const course = await this.courseModel.findOne({ abbreviation: { $eq: abbr }}).exec();
    return course?.lectures;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto);
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
