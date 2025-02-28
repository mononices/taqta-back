import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { GoogleOauthGuard } from 'src/auth/guards/google-oauth.guard';
import { ScheduleListDto } from './dto/create-schedule-list.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GenerateDto } from './dto/generate-schedule-dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Get('/job/:id')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  jobStatus(@Req() req, @Param('id') jobId: string){
    return this.scheduleService.getJobStatus(req.user.id, jobId);
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  save(@Req() req, @Body() saveScheduleListDto: ScheduleListDto){
    return this.scheduleService.save(saveScheduleListDto, req.user.id);
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async generate(@Req() req, @Body() generateDto: GenerateDto){
    return this.scheduleService.generate(generateDto, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
