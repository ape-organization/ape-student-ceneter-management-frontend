import { Injectable } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // In a real application, this would make an HTTP call to a backend API.
  async getNotifications(): Promise<Notification[]> {
    try {
      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'paymentDue',
          title: 'Payments Due',
          message: '3 students did not pay this month.',
          date: new Date(new Date().setDate(new Date().getDate() - 1)),
          read: false,
          link: '/students/payments-due'
        },
        {
          id: '2',
          type: 'classReminder',
          title: 'Class Reminder',
          message: 'Upcoming class "Advanced Mathematics" in 1 hour.',
          date: new Date(),
          read: false,
          link: '/schedule/class/123'
        },
        {
          id: '3',
          type: 'attendanceAlert',
          title: 'Attendance Alert',
          message: 'John Doe has missed 3 consecutive classes.',
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
          read: true,
          link: '/students/attendance/456'
        },
      ];

      // Simulate an API call
      return await firstValueFrom(of(mockNotifications).pipe(delay(500)));
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  // In a real app, this would be a POST/PUT request to the backend
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      console.log(`Notification ${notificationId} marked as read.`);
      return await firstValueFrom(of(true));
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      console.log('All notifications marked as read.');
      return await firstValueFrom(of(true));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }
}