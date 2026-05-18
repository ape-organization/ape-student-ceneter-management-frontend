import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Teacher } from '../../../models'; // Corrected import path
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../material/SharedModule';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [SharedModule, MaterialModule, TranslateModule],
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {
  teacherForm: FormGroup;
  isEditMode: boolean = false;
  // Mock subjects for the select dropdown
  subjects = [
    'SUBJECTS.MATH', 
    'SUBJECTS.SCIENCE', 
    'SUBJECTS.ENGLISH', 
    'SUBJECTS.HISTORY', 
    'SUBJECTS.PHYSICS', 
    'SUBJECTS.CHEMISTRY'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTeacherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Teacher | null
  ) {
    // Check for ID to confirm we are in edit mode since data might be an empty object
    this.isEditMode = !!(data && data.id);
    this.teacherForm = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      phone: [data?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Assuming 10-digit phone
      email: [data?.email || '', [Validators.email]], // Email is optional, removed Validators.required
      paymentMethod: [data?.paymentMethod || 'total', [Validators.required]], // Added paymentMethod
      subject: [data?.subject || '', [Validators.required]],
      salary: [data?.salary || 0, [Validators.required, Validators.min(0)]],
      isActive: [data?.isActive ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.teacherForm.valid) {
      this.dialogRef.close(this.teacherForm.value);
    } else {
      this.teacherForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
