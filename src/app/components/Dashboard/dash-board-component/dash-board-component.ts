import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NotificationsComponent } from '../notifications-component/notifications.component';
import { SmsService } from '../../../Services/sms.service';

@Component({
  selector: 'app-dash-board-component',
  imports: [MaterialModule, TranslateModule, BaseChartDirective],
  templateUrl: './dash-board-component.html',
  styleUrl: './dash-board-component.scss',
})
export class DashBoardComponent implements OnInit {
  smsSentCount: number = 0;

  constructor(private smsService: SmsService) {}

  ngOnInit(): void {
   // this.loadSmsSentCount();
   this.smsSentCount=2
  }

  async loadSmsSentCount() {
    try {
      const result = await this.smsService.getSentToday();
      this.smsSentCount = result?.count || 0;
    } catch (error) {
      console.error('Failed to load SMS stats', error);
    }
  }

  // Attendance Rate Chart
  public attendanceChartData: ChartData<'doughnut'> = {
    labels: ['Attended', 'Absent'],
    datasets: [
      {
        data: [85, 15],
        backgroundColor: ['darkgreen', '#F44336'],
        hoverBackgroundColor: ['darkgreen', '#e53935'],
      },
    ],
  };
  public attendanceChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Monthly Payments Chart
  public paymentsChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12000, 15000, 13000, 17000, 16000, 18000],
        label: 'Monthly Payments ($)',
        backgroundColor: '#1E1A4D',
        borderColor: '#1E1A4D',
        borderWidth: 1,
      },
    ],
  };
  public paymentsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Student Growth Chart
  public growthChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [100, 120, 150, 180, 210, 250],
        label: 'Total Students',
        fill: true,
        backgroundColor: 'rgba(235, 152, 43, 0.8)',
        borderColor: '#f37b0a',
        tension: 0.4,
      },
    ],
  };
  public growthChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
}
