import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  async checkStatus(studentId: string, classId: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/status?studentId=${studentId}&classId=${classId}`)
      );
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  }

  async createPayment(paymentData: any): Promise<any> {
    try {
      return await firstValueFrom(this.http.post<any>(this.apiUrl, paymentData));
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw error;
    }
  }
}