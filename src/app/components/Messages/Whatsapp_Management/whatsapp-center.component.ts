import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../material/SharedModule';

import { MaterialModule } from '../../../material/MaterialModule';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WhatsappService } from '../../../Services/whatsapp.service';
import { ManagementSmsSummary } from '../../Shared_Management/Messages/management-sms-summary/management-sms-summary';
import { ManagementSmsHistory } from '../../Shared_Management/Messages/management-sms-history/management-sms-history';
import { ManagementSmsCompose } from '../../Shared_Management/Messages/management-sms-compose/management-sms-compose';

interface RecipientGroup {
  value: string;
  viewValue: string;
}

interface WhatsappTemplate {
  id: number;
  name: string;
  body: string;
}

interface GradeOption {
  id: number;
  name: string;
  count: number;
}

interface WhatsappHistory {
  id: number;
  sender: string;
  timestamp: Date;
  recipient: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed';
}

@Component({
  selector: 'app-whatsapp-center',
  standalone: true,
  imports: [
SharedModule,    MaterialModule,
 ManagementSmsCompose , ManagementSmsHistory,ManagementSmsSummary
  ],
  templateUrl: './whatsapp-center.component.html',
  styleUrls: ['./whatsapp-center.component.scss']
})
export class WhatsappCenterComponent implements OnInit {
  // Form Models
  selectedRecipientType: string = '';
  selectedClassId: number | null = null;
  selectedGradeId: number | null = null;
  customNumbers: string = '';
  messageBody: string = '';
  isScheduled: boolean = false;
  scheduleDate: Date | null = null;
  statusMessage: string = 'Ready to send...';
  statusType: 'idle' | 'success' | 'error' | 'warning' = 'idle';
  
  // WhatsApp specific
  whatsappStatus: 'online' | 'offline' | 'connecting' = 'connecting';

  // Mock Data
  recipientTypes: RecipientGroup[] = [
    { value: 'all_students', viewValue: 'All Students' },
    { value: 'by_class', viewValue: 'Students by Class' },
    { value: 'by_grade', viewValue: 'Students by Grade' },
    { value: 'unpaid', viewValue: 'Students with Unpaid Payments' },
    { value: 'teachers', viewValue: 'Teachers' },
    { value: 'custom', viewValue: 'Custom Phone Numbers' }
  ];

  classes: any = [
    { id: 1, name: 'Grade 10 - Math A', count: 25 },
    { id: 2, name: 'Grade 10 - Math B', count: 22 },
    { id: 3, name: 'Grade 11 - Physics', count: 30 },
    { id: 4, name: 'Grade 12 - Chemistry', count: 18 }
  ];

  grades: GradeOption[] = [
    { id: 10, name: 'Grade 10', count: 47 },
    { id: 11, name: 'Grade 11', count: 30 },
    { id: 12, name: 'Grade 12', count: 18 }
  ];

  templates: WhatsappTemplate[] = [
    { id: 1, name: 'Absence Alert', body: 'Dear parent, your child was absent today. Please contact us for more information.' },
    { id: 2, name: 'Attendance Confirmation', body: 'Dear parent, your child has safely arrived at the center.' },
    { id: 3, name: 'Exam Results', body: 'Dear student, your exam results are now available. Check your portal for details.' }
  ];

  history: WhatsappHistory[] = [
    { id: 1, sender: 'Admin - Sarah', timestamp: new Date('2024-03-20T10:00:00'), recipient: 'Grade 10 (47 students)', message: 'Reminder: Math exam tomorrow.', status: 'delivered' },
    { id: 2, sender: 'Admin - John', timestamp: new Date('2024-03-21T09:15:00'), recipient: 'Custom: +123456789', message: 'Your child was absent today.', status: 'sent' }
  ];

  isRecipientDropdownOpen = false;
  isTemplateDropdownOpen = false;
  isGradeDropdownOpen = false;
  isClassDropdownOpen = false;
  selectedClass: any = null;

  constructor(private whatsappService: WhatsappService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.checkStatus();
  }

  async checkStatus() {
    try {
      // For now, mock a successful connection after 1 second
      setTimeout(() => {
        this.whatsappStatus = 'online';
      }, 1000);
      
      // Real implementation would call the service:
      // const status = await this.whatsappService.getStatus();
      // this.whatsappStatus = status.connected ? 'online' : 'offline';
    } catch (error) {
      this.whatsappStatus = 'offline';
    }
  }

  toggleRecipientDropdown() {
    this.isRecipientDropdownOpen = !this.isRecipientDropdownOpen;
  }

  toggleTemplateDropdown() {
    this.isTemplateDropdownOpen = !this.isTemplateDropdownOpen;
  }

  toggleGradeDropdown() {
    this.isGradeDropdownOpen = !this.isGradeDropdownOpen;
  }

  toggleClassDropdown() {
    this.isClassDropdownOpen = !this.isClassDropdownOpen;
  }

  selectRecipient(type: any) {
    this.selectedRecipientType = type.value;
    this.isRecipientDropdownOpen = false;
  }

  selectTemplate(template: WhatsappTemplate) {
    this.messageBody = template.body;
    this.isTemplateDropdownOpen = false;
  }

  selectGrade(grade: GradeOption) {
    this.selectedGradeId = grade.id;
    this.isGradeDropdownOpen = false;
  }

  selectClass(cls: any) {
    this.selectedClass = cls;
    this.selectedClassId = cls.id;
    this.isClassDropdownOpen = false;
  }

  get currentRecipientCount(): number {
    switch (this.selectedRecipientType) {
      case 'all_students': return 150;
      case 'teachers': return 12;
      case 'unpaid': return 45;
      case 'by_class':
        const selectedClass = this.classes.find((c:any) => c.id === this.selectedClassId);
        return selectedClass ? selectedClass.count : 0;
      case 'by_grade':
        const selectedGrade = this.grades.find(g => g.id === this.selectedGradeId);
        return selectedGrade ? selectedGrade.count : 0;
      case 'custom':
        return this.customNumbers
          ? this.customNumbers.split(',').filter(n => n.trim().length > 0).length
          : 0;
      default: return 0;
    }
  }

  get messageLength(): number {
    return this.messageBody.length;
  }

  async sendMessage(data:any): Promise<void> {
    if (this.whatsappStatus !== 'online') {
      this.setFeedback('WhatsApp is not connected. Please check your connection.', 'error');
      return;
    }

    let recipientStr = '';
    switch (this.selectedRecipientType) {
      case 'all_students': recipientStr = 'All Students'; break;
      case 'teachers': recipientStr = 'Teachers'; break;
      case 'unpaid': recipientStr = 'Unpaid Payments'; break;
      case 'by_class': recipientStr = `Class: ${this.selectedClass?.name || 'Unknown'}`; break;
      case 'by_grade': recipientStr = `Grade: ${this.grades.find(g => g.id === this.selectedGradeId)?.name || 'Unknown'}`; break;
      case 'custom': recipientStr = `Custom: ${this.customNumbers.substring(0, 20)}...`; break;
    }

    const payload = {
      type: this.selectedRecipientType,
      classId: this.selectedClassId,
      gradeId: this.selectedGradeId,
      customNumbers: this.customNumbers,
      message: this.messageBody,
      scheduled: this.isScheduled ? this.scheduleDate : null
    };

    try {
      // Mock API call
      console.log('Sending WhatsApp message:', payload);
      // await this.whatsappService.send(payload);

      this.history.unshift({
        id: this.history.length + 1,
        sender: 'Current User',
        timestamp: new Date(),
        recipient: recipientStr,
        message: this.messageBody,
        status: 'sent'
      });

      // Reset
      this.messageBody = '';
      this.selectedRecipientType = '';
      this.selectedClass = null;
      this.selectedClassId = null;
      this.selectedGradeId = null;
      this.customNumbers = '';
      this.isScheduled = false;
      this.scheduleDate = null;
      
      this.setFeedback('WhatsApp message(s) sent successfully!', 'success');
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      this.setFeedback('Failed to send WhatsApp message. Please try again.', 'error');
    }
  }

  private setFeedback(msg: string, type: 'success' | 'error' | 'warning') {
    this.statusMessage = msg;
    this.statusType = type;
    this.snackBar.open(msg, 'Close', { 
      duration: 3000, 
      panelClass: [`snackbar-${type}`] 
    });
    setTimeout(() => {
      if (this.statusType !== 'idle') this.statusType = 'idle';
    }, 5000);
  }
}
