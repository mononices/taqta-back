import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionSchema } from './session.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from 'src/course/course.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: "Session", schema: SessionSchema}, {name: "Course", schema: CourseSchema}])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
