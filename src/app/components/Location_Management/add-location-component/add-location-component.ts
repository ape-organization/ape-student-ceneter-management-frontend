import { Component, Inject, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-location-component',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, TranslateModule, CommonModule, MatDialogModule],
  templateUrl: './add-location-component.html',
  styleUrl: './add-location-component.scss',
})
export class AddLocationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddLocationComponent>);
  
  protected locationForm!: FormGroup;
  protected isEditMode: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Location | null) {}

  ngOnInit(): void {
    // Check for ID to confirm we are in edit mode
    this.isEditMode = !!(this.data && this.data.id);
    
    this.locationForm = this.fb.group({
      id: [this.data?.id],
      branch: [this.data?.branch || '', [Validators.required]],
      classroom: [this.data?.classroom || '', [Validators.required]],
      capacity: [this.data?.capacity || 0, [Validators.required, Validators.min(1)]],
      isActive: [this.data?.isActive ?? true]
    });
  }

  protected onSubmit(): void {
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);
    } else {
      this.locationForm.markAllAsTouched();
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
