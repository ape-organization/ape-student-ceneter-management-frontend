import { Component, Inject, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../material/SharedModule';

@Component({
  selector: 'app-add-subject-component',
  standalone: true,
  imports: [MaterialModule, SharedModule, TranslateModule],
  templateUrl: './add-subject-component.html',
  styleUrl: './add-subject-component.scss',
})
export class AddSubjectComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddSubjectComponent>);
  protected readonly data = inject<Subject>(MAT_DIALOG_DATA);

  protected subjectForm!: FormGroup;
  protected isEditMode: boolean = false;

  ngOnInit(): void {
    this.isEditMode = !!(this.data && this.data.id);
    this.subjectForm = this.fb.group({
      id: [this.data?.id],
      name: [this.data?.name || '', [Validators.required]],
      isActive: [this.data?.isActive ?? true]
    });
  }

  protected onSubmit(): void {
    if (this.subjectForm.valid) {
      this.dialogRef.close(this.subjectForm.value);
    } else {
      // Mark all fields as touched to display validation errors
      this.subjectForm.markAllAsTouched();
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(); // Close without returning data
  }
}
