import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';

  constructor(private http: HttpClient, private router: Router) {}

  async login(credentials: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/auth/login`, credentials));
      this.storeTokens(response.token, response.refreshToken);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw for the component to handle
    }
  }

  async refreshToken(): Promise<any> {
    try {
      const refreshToken = this.getRefreshToken();
      const response = await firstValueFrom(this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken }));
      this.storeTokens(response.token, response.refreshToken);
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error; // Re-throw for the interceptor to handle
    }
  }

  storeTokens(token: string, refreshToken: string): void {
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}