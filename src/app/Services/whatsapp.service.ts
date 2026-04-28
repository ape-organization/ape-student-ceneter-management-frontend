import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {
  private readonly apiUrl = 'http://localhost:3000/api/whatsapp';

  constructor(private http: HttpClient) {}

  async getSentToday(): Promise<any> {
    try {
      return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/sent-today`));
    } catch (error) {
      console.error('Failed to get WhatsApp messages sent today:', error);
      throw error;
    }
  }

  async send(data: any): Promise<any> {
    try {
      return await firstValueFrom(this.http.post<any>(`${this.apiUrl}/send`, data));
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  async getStatus(): Promise<any> {
    try {
      return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/status`));
    } catch (error) {
      console.error('Failed to get WhatsApp status:', error);
      throw error;
    }
  }
}
