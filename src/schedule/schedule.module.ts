import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from './schedule.schema';
import { UserSchema } from 'src/user/user.schema';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { join } from 'path';
import { pathToFileURL } from 'url';

@Module({
  imports: [MongooseModule.forFeature([{name: "Schedule", schema: ScheduleSchema}, {name: "User", schema: UserSchema}]), 
  BullModule.registerQueue({
      name: 'generator',
      processors: [pathToFileURL(join(__dirname, 'processors/generation.processor.js'))]
  })],  
  controllers: [ScheduleController],
  providers: [ScheduleService, { provide: APP_GUARD, useClass: ThrottlerGuard}],
})
export class ScheduleModule {}
