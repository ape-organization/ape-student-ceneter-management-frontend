import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../../material/MaterialModule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-management-sms-summary',
  imports: [ MaterialModule ,CommonModule],
  templateUrl: './management-sms-summary.html',
  styleUrl: './management-sms-summary.scss',
})
export class ManagementSmsSummary {
@Input() recipientCount = 0;

  @Input() totalSMS = 0;
}
