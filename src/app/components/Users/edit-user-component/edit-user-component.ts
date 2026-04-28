import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-component',
  imports: [],
  templateUrl: './edit-user-component.html',
  styleUrl: './edit-user-component.scss',
})
export class EditUserComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private dialogRef: MatDialogRef<EditUserComponent>
) {}
close()
{
  this.dialogRef.close();
}
}
