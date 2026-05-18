import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../material/SharedModule';

@Component({
  selector: 'app-add-student-component',
  standalone: true,
  imports: [SharedModule, MaterialModule, TranslateModule],
  templateUrl: './add-student-component.html',
  styleUrls: ['./add-student-component.scss']
})
export class AddStudentComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode: boolean = false;
  
  // Mock grades for the select dropdown
  grades = [
    'GRADES.GRADE_1', 
    'GRADES.GRADE_2', 
    'GRADES.GRADE_3', 
    'GRADES.GRADE_4', 
    'GRADES.GRADE_5', 
    'GRADES.GRADE_6',
    'GRADES.GRADE_7',
    'GRADES.GRADE_8',
    'GRADES.GRADE_9'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student | null
  ) {
    // Check for ID to confirm we are in edit mode since data might be an empty object
    this.isEditMode = !!(data && data.id);
    this.studentForm = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      phone: [data?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      parentPhone: [data?.parentPhone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      grade: [data?.grade || '', [Validators.required]],
      discount: [data?.discount || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [data?.isActive ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
