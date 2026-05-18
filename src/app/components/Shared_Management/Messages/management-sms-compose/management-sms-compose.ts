import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../material/MaterialModule';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../material/SharedModule';

@Component({
  selector: 'app-management-sms-compose',
  imports: [ MaterialModule ,CommonModule,SharedModule],
  templateUrl: './management-sms-compose.html',
  styleUrl: './management-sms-compose.scss',
})
export class ManagementSmsCompose {
/////

  @Input() recipientTypes: any[] = [];
  @Input() classes: any[] = [];
  @Input() grades: any[] = [];
  @Input() templates: any[] = [];

  @Output() sendMessageEvent =
    new EventEmitter<any>();

  selectedRecipientType = '';

  selectedClass: any = null;

  selectedGrade: any = null;

  customNumbers = '';

  messageBody = '';

  isScheduled = false;

  scheduleDate = '';

  get messageLength(): number {
    return this.messageBody.length;
  }

  get smsSegments(): number {
    return Math.ceil(
      this.messageBody.length / 160
    ) || 1;
  }

  onTemplateSelect(event: any): void {

    const templateId = +event.target.value;

    const template =
      this.templates.find(
        t => t.id === templateId
      );

    if (template) {
      this.messageBody = template.content;
    }

  }

  resetForm(): void {

    this.selectedRecipientType = '';

    this.selectedClass = null;

    this.selectedGrade = null;

    this.customNumbers = '';

    this.messageBody = '';

    this.isScheduled = false;

    this.scheduleDate = '';

  }

  sendMessage(): void {

    const payload = {

      recipientType:
        this.selectedRecipientType,

      selectedClass:
        this.selectedClass,

      selectedGrade:
        this.selectedGrade,

      customNumbers:
        this.customNumbers,

      message:
        this.messageBody,

      isScheduled:
        this.isScheduled,

      scheduleDate:
        this.scheduleDate

    };

    this.sendMessageEvent.emit(payload);

  }


////
}
