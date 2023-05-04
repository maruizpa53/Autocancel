import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronController } from './app.controller';
import ApiService from './app.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [CronController],
  providers: [ApiService],
})
export class AppModule {}
