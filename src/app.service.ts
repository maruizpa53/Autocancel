import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiService {
  async postData(): Promise<any> {
    const body = {
      types: ['Active'],
    };
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '5018266f057b4ce093e247b73944350a',
    };
    const response = await axios.post(
      'https://autocab-api.azure-api.net/booking/v1/1.2/search',
      body,
      {
        headers,
      },
    );
    console.log(response.data);
    return response.data.bookings;
  }

  async deleteData(bookingId: number): Promise<void> {
    const headers = {
      'Ocp-Apim-Subscription-Key': '5018266f057b4ce093e247b73944350aY',
    };
    await axios.delete(
      `https://autocab-api.azure-api.net/booking/v1/booking/${bookingId}`,
      {
        headers,
      },
    );
  }
}
