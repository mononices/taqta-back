import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from './schedule/schedule.module';
import { configuration } from './config/configuration';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:thisisaverylongpasswordhorsebojack@localhost:27017', {
    dbName: 'taqta'
  }),
  ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }), 
  CourseModule, SessionModule, UserModule, ScheduleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
