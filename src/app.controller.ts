import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiService } from './app.service';

@Controller()
export class CronController {
  constructor(private readonly apiService: ApiService) {}

  @Cron('0 */1 * * * *') // Ejecuta el método cada 5 minutos
  async handleCron() {
    const data = await this.apiService.postData();
    const id = data.bookings;
    await this.apiService.deleteData(id);
  }
}
