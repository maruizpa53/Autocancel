import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import ApiService from './app.service';

@Controller()
export class CronController {
  constructor(private readonly apiService: ApiService) {}

  @Cron('*/45 * * * * *') // Ejecuta el método cada 30 segundos
  async handleCron() {
    const data = await this.apiService.getData_v1();
    if (data) {
      await this.apiService.releaseBooking_v1(data);
      return;
    }
  }
}
