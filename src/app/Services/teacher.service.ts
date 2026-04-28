import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Teacher } from '../models/Teacher';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly apiUrl = 'http://localhost:3000/api/teachers';

  constructor(private http: HttpClient) {}

  async getAll(): Promise<Teacher[]> {
    try {
      return await firstValueFrom(this.http.get<Teacher[]>(this.apiUrl));
    } catch (error) {
      console.error('Failed to get all teachers:', error);
      throw error;
    }
  }

  async getById(id: number | string): Promise<Teacher> {
    try {
      return await firstValueFrom(this.http.get<Teacher>(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error(`Failed to get teacher with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: Teacher): Promise<Teacher> {
    try {
      return await firstValueFrom(this.http.post<Teacher>(this.apiUrl, data));
    } catch (error) {
      console.error('Failed to create teacher:', error);
      throw error;
    }
  }

  async update(id: number | string, data: Teacher): Promise<Teacher> {
    try {
      return await firstValueFrom(this.http.put<Teacher>(`${this.apiUrl}/${id}`, data));
    } catch (error) {
      console.error(`Failed to update teacher with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number | string): Promise<any> {
    try {
      return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error(`Failed to delete teacher with id ${id}:`, error);
      throw error;
    }
  }
}
