import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  async getAll(): Promise<any[]> {
    try {
      return await firstValueFrom(this.http.get<any[]>(this.apiUrl));
    } catch (error) {
      console.error('Failed to get all students:', error);
      throw error;
    }
  }

  async getById(id: number | string): Promise<any> {
    try {
      return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error(`Failed to get student with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      return await firstValueFrom(this.http.post<any>(this.apiUrl, data));
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  }

  async update(id: number | string, data: any): Promise<any> {
    try {
      return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, data));
    } catch (error) {
      console.error(`Failed to update student with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number | string): Promise<any> {
    try {
      return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    } catch (error) {
      console.error(`Failed to delete student with id ${id}:`, error);
      throw error;
    }
  }
}