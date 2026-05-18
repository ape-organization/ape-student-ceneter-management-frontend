import { Component, OnInit } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { Notification, NotificationType } from '../../../models/notification.model';
import { NotificationService } from '../../../Services/notification.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../../material/MaterialModule';
import { MatDialog } from '@angular/material/dialog';
import { ShowDetailsComponent } from '../../Shared/show-details-component/show-details-component';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    MaterialModule
  
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications$!: Observable<Notification[]>;
  unreadCount$!: Observable<number>;

  constructor(private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.notifications$ = from(this.notificationService.getNotifications());
 
  this.unreadCount$ = this.notifications$.pipe(
  map(n => n.filter(x => !x.read).length),
  startWith(0)
);
  }

  onNotificationClick(notification: Notification): void {
   /*  if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
      // For demo purposes, we'll just update the object.
      // In a real app, you might refetch notifications.
      notification.read = true;
    } */
this.dialog.open(ShowDetailsComponent, {
  data: notification,
  width: '400px'
});
  }

  onMarkAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead().then(() => {
        this.notifications$ = from(this.notificationService.getNotifications()).pipe(map(n => n.map(i => ({...i, read: true}))));
        this.unreadCount$ = of(0);
    });
  }

  getIcon(type: NotificationType): string {
    const iconMap: Record<NotificationType, string> = {
      paymentDue: 'payment',
      classReminder: 'schedule',
      attendanceAlert: 'warning'
    };
    return iconMap[type] || 'notifications';
  }
}