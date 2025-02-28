import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { CourseResponseDto } from "src/course/dto/course-response.dto";

export class PartialCourseDto{
    @Expose()
    @Transform((value) => CourseResponseDto.fromDocument(value.obj.body))
    body: CourseResponseDto;
    @Expose()
    @Transform((value) => Object.fromEntries(value.obj.picked))
    picked: Record<string, string>;
}

export class ScheduleResponseDto {
    @Expose()
    @Transform((value) => value.obj._id.toString())
    _id: string;
    @Expose()
    @ValidateNested({each: true})
    @Transform((value) => value.obj.courses.map((course) => plainToInstance(PartialCourseDto, course, {excludeExtraneousValues: true, enableCircularCheck: true})))
    //@Type(() => PartialCourseDto)
    courses: PartialCourseDto[]   
}

export class ScheduleListResponseDto {
    @Expose()
    @Transform((value) => value.obj.schedules.map((schedule) => plainToInstance(ScheduleResponseDto, schedule, {excludeExtraneousValues: true, enableCircularCheck: true})))
    schedules: ScheduleResponseDto[]
}