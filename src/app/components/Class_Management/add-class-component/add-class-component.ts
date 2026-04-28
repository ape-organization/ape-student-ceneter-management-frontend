import { Component, Inject, OnInit, computed, signal } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ClassModel, Teacher, Location } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../../Services/class.service';
import { TeacherService } from '../../../Services/teacher.service';
import { LocationService } from '../../../Services/location.service';

@Component({
  selector: 'app-add-class-component',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, TranslateModule, CommonModule, MatDialogModule],
  templateUrl: './add-class-component.html',
  styleUrl: './add-class-component.scss',
})
export class AddClassComponent implements OnInit {
  classForm: FormGroup;
  isEditMode: boolean = false;

  protected  teachers:any[] = [];
  protected readonly locations = signal<Location[]>([]);

  subjects = [
    'SUBJECTS.MATH', 'SUBJECTS.SCIENCE', 'SUBJECTS.ARABIC', 'SUBJECTS.ENGLISH', 'SUBJECTS.HISTORY'
  ];

  grades = [
    'GRADES.GRADE_1', 'GRADES.GRADE_2', 'GRADES.GRADE_3', 
    'GRADES.GRADE_4', 'GRADES.GRADE_5', 'GRADES.GRADE_6',
    'GRADES.GRADE_7', 'GRADES.GRADE_8', 'GRADES.GRADE_9'
  ];

  // Calculated total price signal for the UI
  protected totalPrice = computed(() => {
    const capacity = this.classForm?.get('capacity')?.value || 0;
    const price = this.classForm?.get('price')?.value || 0;
    return capacity * price;
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddClassComponent>,
    private teacherService: TeacherService,
    private locationService: LocationService,
    @Inject(MAT_DIALOG_DATA) public data: any | null
  ) {
    this.isEditMode = !!(data && data.id);
    
    this.classForm = this.fb.group({
      id: [data?.id],
      name: [data?.name || '', [Validators.required]],
      subject: [data?.subject || '', [Validators.required]],
      teacherId: [data?.teacherId, [Validators.required]],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      capacity: [data?.capacity || 1, [Validators.required, Validators.min(1)]],
      grade: [data?.grade || '', [Validators.required]],
      locationId: [data?.locationId, [Validators.required]],
      dayFrom: [data?.dayFrom || ''],
      dayTo: [data?.dayTo || ''],
      hourFrom: [data?.hourFrom || ''],
      hourTo: [data?.hourTo || ''],
      paymentMethod: [data?.paymentMethod || 'month'],
      isActive: [data?.isActive ?? true]
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
    this.loadLocations();
  }

  private async loadTeachers(): Promise<void> {
    try {
      var teachers:any = await this.teacherService.getAll();
      this.teachers=teachers;
    } catch (error) {
      console.error('Failed to load teachers', error);
    }
  }

  private async loadLocations(): Promise<void> {
    try {
      const locations = await this.locationService.getAll();
      this.locations.set(locations);
    } catch (error) {
      console.error('Failed to load locations', error);
    }
  }

  protected onSubmit(): void {
    if (this.classForm.valid) {
      const result = { ...this.classForm.value, totalPrice: this.totalPrice() };
      this.dialogRef.close(result);
    } else {
      this.classForm.markAllAsTouched();
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
