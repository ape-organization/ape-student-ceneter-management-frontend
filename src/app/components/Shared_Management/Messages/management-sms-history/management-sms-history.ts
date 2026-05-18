import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/MaterialModule';

@Component({
  selector: 'app-management-sms-history',
  imports: [CommonModule,MaterialModule],
  templateUrl: './management-sms-history.html',
  styleUrl: './management-sms-history.scss',
})
export class ManagementSmsHistory {
 @Input() history: any[] = [];
}
