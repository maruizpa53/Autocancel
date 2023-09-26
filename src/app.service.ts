import { Injectable } from '@nestjs/common';
import axios from 'axios';
import moment = require('moment');

const API_URL =
  'https://ghost-main-static-4466116591644d61aca9e493190e3297.ghostapi.app:29003/api/v1';
@Injectable()
export default class ApiService {
  // Metodo de Web API / Ghost - METODO - POST
  async getToken(): Promise<any> {
    const body = {
      username: 'automator',
      password: 'Autocabad1*',
    };

    const response = await axios.post(`${API_URL}/authenticate`, body);
    return response.data;
  }
  // Metodo de Web API / Ghost - METODO - GET
  async getData_v1(): Promise<any> {
    const token = await this.getToken();
    const headers = {
      'Authentication-Token': token.secret,
    };
    const response = await axios.get(`${API_URL}/bookings/active`, { headers });
    // console.log(response.data); - Muestra todos los detalles de la reserva
    return response.data;
  }

  async releaseBooking_v1(bookings: any[]): Promise<void> {
    const token = await this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authentication-Token': token.secret,
    };

    await Promise.all(
      bookings.map(async (booking) => {
        // Set the reference datetime
        const referenceDatetime = moment(booking.bookedAtTime);
        // Get the current datetime
        const currentDatetime = moment();
        // Calculate the time difference between the reference datetime and the current datetime
        const timeDifference = moment.duration(
          currentDatetime.diff(referenceDatetime),
        );
        // Check if more than 1 minutes have passed
        if (timeDifference.asSeconds() >= 45) {
          try {
            // Utiliza response.data de getData_v1 como el cuerpo en la solicitud POST
            const dataFromGetDataV1 = await this.getData_v1(); // Obtener los datos de getData_v1
            // Valida si 'hold' es true y 'capabilities' no es [2, 11] para la reserva actual
            if (
              dataFromGetDataV1.some(
                (reserva: { id: any; hold: boolean; capabilities: number[] }) =>
                  reserva.id === booking.id &&
                  reserva.hold === true &&
                  ((reserva.capabilities.includes(2) &&
                    !reserva.capabilities.includes(11)) ||
                    (!reserva.capabilities.includes(2) &&
                      reserva.capabilities.includes(11))),
              )
            ) {
              await axios.post(
                `${API_URL}/bookings/${booking.id}/release`,
                dataFromGetDataV1,
                {
                  headers,
                },
              );
              console.log('Voy a Liberar el ID: ', booking.id);
            } else {
              console.log(
                'No liberar, hold no es true o capabilities no cumple con los requisitos.',
              );
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('No liberar, todavía no es el momento!');
        }
      }),
    );
  }
}
