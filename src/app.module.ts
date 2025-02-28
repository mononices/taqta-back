import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from './schedule/schedule.module';
import { configuration } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

export const throttlerConfig = (config: ConfigService): ThrottlerModuleOptions => ({
  throttlers: [{
    ttl: config.get<number>('THROTTLE_TTL') ?? 60000,
    limit: config.get<number>('THROTTLE_LIMIT') ?? 10,
  }]
});

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:thisisaverylongpasswordhorsebojack@localhost:27017', {
    dbName: 'taqta'
  }),
  ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }),
  ThrottlerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: throttlerConfig
  }),
  BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
  }),
  BullModule.registerQueue({
      name: 'generator',
  }),
  CourseModule, SessionModule, UserModule, ScheduleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
