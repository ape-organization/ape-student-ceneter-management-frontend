export type NotificationType = 'paymentDue' | 'classReminder' | 'attendanceAlert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  link?: string; // e.g., '/students/payments'
}