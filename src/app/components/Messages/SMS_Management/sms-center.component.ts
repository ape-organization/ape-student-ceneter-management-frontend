import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from '../../../material/material-module';

interface RecipientGroup {
  value: string;
  viewValue: string;
}

interface SMSTemplate {
  id: number;
  name: string;
  body: string;
}

interface GradeOption {
  id: number;
  name: string;
  count: number;
}

interface SMSHistory {
  id: number;
  sender: string;
  timestamp: Date;
  recipient: string;
  message: string;
}

@Component({
  selector: 'app-sms-center',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
   MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './sms-center.component.html',
  styleUrls: ['./sms-center.component.scss']
})
export class SmsCenterComponent {
  // Form Models
  selectedRecipientType: string = '';
  selectedClassId: number | null = null;
  selectedGradeId: number | null = null;
  customNumbers: string = '';
  messageBody: string = '';
  isScheduled: boolean = false;
  scheduleDate: Date | null = null;

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

  templates: SMSTemplate[] = [
    { id: 1, name: 'Absence Alert', body: 'Dear parent, your child was absent today. Please contact us for more information.' },
    { id: 2, name: 'Attendance Confirmation', body: 'Dear parent, your child has safely arrived at the center.' },
    { id: 3, name: 'Exam Results', body: 'Dear student, your exam results are now available. Check your portal for details.' }
  ];

  history: SMSHistory[] = [
    { id: 1, sender: 'Admin - Sarah', timestamp: new Date('2024-03-20T10:00:00'), recipient: 'Grade 10 (47 students)', message: 'Reminder: Math exam tomorrow.' },
    { id: 2, sender: 'Admin - John', timestamp: new Date('2024-03-21T09:15:00'), recipient: 'Custom: +123456789', message: 'Your child was absent today.' }
  ];

//////
isRecipientDropdownOpen = false;
isTemplateDropdownOpen = false;
isGradeDropdownOpen = false;

toggleRecipientDropdown() {
  this.isRecipientDropdownOpen = !this.isRecipientDropdownOpen;
}

toggleTemplateDropdown() {
  this.isTemplateDropdownOpen = !this.isTemplateDropdownOpen;
}

toggleGradeDropdown() {
  this.isGradeDropdownOpen = !this.isGradeDropdownOpen;
}

selectRecipient(type: any) {
  this.selectedRecipientType = type.value;
  this.isRecipientDropdownOpen = false;
}

selectTemplate(template: SMSTemplate) {
  this.messageBody = template.body;
  this.isTemplateDropdownOpen = false;
}

selectGrade(grade: GradeOption) {
  this.selectedGradeId = grade.id;
  this.isGradeDropdownOpen = false;
}
///////////////
isClassDropdownOpen = false;

selectedClass: any = null;

toggleClassDropdown() {
  this.isClassDropdownOpen = !this.isClassDropdownOpen;
}

selectClass(cls: any) {
  this.selectedClass = cls;
  this.selectedClassId = cls.id;
  this.isClassDropdownOpen = false;
}
  // Helpers

  get currentRecipientCount(): number {
    switch (this.selectedRecipientType) {
      case 'all_students': return 150; // Mock total
      case 'teachers': return 12;      // Mock total
      case 'unpaid': return 45;        // Mock total
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

  get smsSegments(): number {
    if (this.messageLength === 0) return 0;
    return Math.ceil(this.messageLength / 160);
  }

  get totalEstimatedSMS(): number {
    return this.smsSegments * this.currentRecipientCount;
  }

  sendMessage(): void {
    // Mock save to history
    let recipientStr = '';
    switch (this.selectedRecipientType) {
      case 'all_students': recipientStr = 'All Students'; break;
      case 'teachers': recipientStr = 'Teachers'; break;
      case 'unpaid': recipientStr = 'Unpaid Payments'; break;
      case 'by_class': recipientStr = `Class: ${this.selectedClass?.name || 'Unknown'}`; break;
      case 'by_grade': recipientStr = `Grade: ${this.grades.find(g => g.id === this.selectedGradeId)?.name || 'Unknown'}`; break;
      case 'custom': recipientStr = `Custom: ${this.customNumbers.substring(0, 20)}...`; break;
    }

    this.history.unshift({
      id: this.history.length + 1,
      sender: 'Current User', // Mock
      timestamp: new Date(),
      recipient: recipientStr,
      message: this.messageBody
    });

    console.log({
      type: this.selectedRecipientType,
      class: this.selectedClassId,
      grade: this.selectedGradeId,
      custom: this.customNumbers,
      message: this.messageBody,
      scheduled: this.isScheduled ? this.scheduleDate : 'Now'
    });
    
    // Reset or feedback
    this.messageBody = '';
    this.selectedRecipientType = '';
  }
}