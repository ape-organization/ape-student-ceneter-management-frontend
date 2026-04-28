import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material-module';
import { AttendanceService } from '../../../Services/attendance.service';
import { StudentService } from '../../../Services/student.service';
import { PaymentService } from '../../../Services/payment.service';
import { SmsService } from '../../../Services/sms.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable, startWith, map, of } from 'rxjs';

@Component({
  selector: 'app-scan-attendance',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './scan-attendance.component.html',
  styleUrl: './scan-attendance.component.scss'
})
export class ScanAttendanceComponent implements OnInit {
  // Modes: 0 - Scan, 1 - Name Search, 2 - Manual Entry
  selectedTabIndex: number = 0;
  
  scanBuffer: string = '';
  manualId: string = '';
  
  // Name Search
  studentSearchControl = new FormControl('');
  allStudents: any[] = [];
  filteredStudents: Observable<any[]> = of([]);
  
  lastScannedStudent: any = null;
  isProcessing: boolean = false;
  statusMessage: string = 'Ready to scan...';
  statusType: 'idle' | 'success' | 'error' | 'warning' = 'idle';

  pendingPayment: {
    amountDue: number;
    isMandatory: boolean;
    type: 'MONTHLY' | 'BY_CLASS';
    reason: string;
  } | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
    private paymentService: PaymentService,
    private smsService: SmsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    
    this.filteredStudents = this.studentSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStudents(value || ''))
    );
  }

  private async loadStudents() {
    try {
      //this.allStudents = await this.studentService.getAll();
      this.allStudents = [
        {name: 'John Doe', id: '123', phone: '555-0101', classType: 'MONTHLY'}, 
        {name: 'Jane Smith', id: '456', phone: '555-0102', classType: 'BY_CLASS'}
      ]; // Mock data for testing

    } catch (error) {
      console.error('Failed to load students for search', error);
    }
  }

  private _filterStudents(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.allStudents.filter(student => 
      student.name.toLowerCase().includes(filterValue) || 
      student.id.toString().includes(filterValue)
    );
  }

  onStudentSelected(event: any) {
    const student = event.option.value;
    if (student) {
      this.processAttendance(student, 'NAME_SEARCH');
      this.studentSearchControl.setValue('');
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Only handle global keys if in Scan tab (0)
    if (this.selectedTabIndex !== 0) return;
    
    // Ignore events if a dialog is open or processing
    // Also ignore if the user is typing in an input field (shouldn't happen in scan tab but for safety)
    const target = event.target as HTMLElement;
    if (this.isProcessing || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    if (event.key === 'Enter') {
      if (this.scanBuffer.length > 2) {
        this.processScan(this.scanBuffer.trim());
      }
      this.scanBuffer = '';
    } else {
      if (event.key.length === 1) {
        this.scanBuffer += event.key;
      }
    }
  }

  onManualSubmit() {
    if (this.manualId && this.manualId.trim().length > 2) {
      this.processScan(this.manualId.trim(), 'MANUAL_ENTRY');
      this.manualId = '';
    }
  }

  async processScan(code: string, method: string = 'QR_SCAN') {
    this.isProcessing = true;
    this.statusMessage = 'Fetching student...';
    this.statusType = 'idle';

    try {
      const student = await this.studentService.getById(code);
      if (!student) {
        this.setFeedback('Student not found!', 'error');
        return;
      }
      await this.processAttendance(student, method);
    } catch (error) {
      this.setFeedback('Student not found or system error.', 'error');
    } finally {
      this.isProcessing = false;
    }
  }

  async processAttendance(student: any, method: string) {
    this.isProcessing = true;
    this.statusMessage = 'Marking attendance...';
    this.lastScannedStudent = {
      ...student,
      scanTime: new Date()
    };
    this.pendingPayment = null;

    try {
      // Check Attendance for Today
      const alreadyMarked = await this.attendanceService.checkTodayAttendance(student.id);
      if (alreadyMarked) {
        this.setFeedback(`${student.name} already marked for today.`, 'warning');
        return;
      }

      // Mark Attendance
      await this.attendanceService.markAttendance({
        studentId: student.id,
        timestamp: new Date(),
        method: method
      });

      // Check Payment Status
      const paymentStatus = await this.paymentService.checkStatus(student.id, student.currentClassId);
      const classType = student.classType || 'MONTHLY'; // Default if not specified

      if (!paymentStatus || paymentStatus.status !== 'PAID') {
        const amountDue = paymentStatus?.amountDue || 0;
        const isMandatory = classType === 'BY_CLASS';
        
        this.pendingPayment = {
          amountDue: amountDue,
          isMandatory: isMandatory,
          type: classType as any,
          reason: isMandatory ? 'Class payment required' : 'Monthly fee pending'
        };

        if (isMandatory) {
          this.setFeedback(`${student.name}: Attendance marked but payment is REQUIRED!`, 'error');
        } else {
          this.setFeedback(`Attendance marked. Payment required for ${student.name}`, 'warning');
          
          // End of month reach check: send SMS if within last 5 days of month
          const today = new Date();
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          if (today.getDate() >= lastDayOfMonth - 5) {
            this.sendLatePaymentAlert(student);
          }
        }
      } else {
        this.setFeedback(`Welcome, ${student.name}! Marked successfully via ${method.replace('_', ' ')}.`, 'success');
        
        // SMS Notification
        this.smsService.send({
          to: student.phone,
          message: `Hello, ${student.name} has arrived at the center at ${new Date().toLocaleTimeString()}.`
        }).catch(err => console.error('SMS notification failed', err));
      }

    } catch (error) {
      console.error('Attendance error:', error);
      this.setFeedback('Failed to mark attendance. Please try again.', 'error');
    } finally {
      this.isProcessing = false;
      setTimeout(() => {
        if (this.statusType !== 'idle') this.statusType = 'idle';
      }, 5000);
    }
  }

  private async sendLatePaymentAlert(student: any) {
    this.smsService.send({
      to: student.phone,
      message: `Center Alert: Monthly payment for ${student.name} is due. Please settle the balance to avoid service interruption.`
    }).catch(err => console.error('Late payment SMS notification failed', err));
  }

  async onCollectPayment(mode: 'FULL' | 'PARTIAL') {
    if (!this.pendingPayment || !this.lastScannedStudent) return;
    
    let amount = this.pendingPayment.amountDue;
    if (mode === 'PARTIAL') {
      const val = prompt('Enter payment amount:', '20');
      if (!val || isNaN(Number(val))) return;
      amount = Number(val);
    }

    try {
      this.isProcessing = true;
      // In a real app: await this.paymentService.record({ studentId: this.lastScannedStudent.id, amount });
      this.setFeedback(`Payment of ${amount} recorded for ${this.lastScannedStudent.name}.`, 'success');
      this.pendingPayment = null;
      this.statusType = 'success';
    } catch (error) {
      this.setFeedback('Failed to process payment.', 'error');
    } finally {
      this.isProcessing = false;
    }
  }

  private setFeedback(msg: string, type: 'success' | 'error' | 'warning') {
    this.statusMessage = msg;
    this.statusType = type;
    this.snackBar.open(msg, 'Close', { 
      duration: 3000, 
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}