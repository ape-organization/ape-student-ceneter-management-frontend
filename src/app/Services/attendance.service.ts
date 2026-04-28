import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StudentService } from './student.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly apiUrl = 'http://localhost:3000/api/attendance';

  constructor(
    private http: HttpClient,
    private studentService: StudentService
  ) {}

  async checkTodayAttendance(studentId: string): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/check-today?studentId=${studentId}`)
      );
      return result.alreadyMarked;
    } catch (error) {
      console.error('Error checking today attendance:', error);
      return false;
    }
  }

  async markAttendance(attendanceData: any): Promise<any> {
    try {
      return await firstValueFrom(this.http.post<any>(this.apiUrl, attendanceData));
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw error;
    }
  }

  async getAttendanceHistory(filters: any): Promise<any[]> {
    try {
      return await firstValueFrom(
        this.http.get<any[]>(this.apiUrl, { params: filters })
      );
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }
  }
}