import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-show-details-component',
  imports: [MaterialModule],
  templateUrl: './show-details-component.html',
  styleUrl: './show-details-component.scss',
})
export class ShowDetailsComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
 private dialogRef: MatDialogRef<ShowDetailsComponent>
) {}
message: string = 'This is a simple message.';

ngOnInit() {
  this.message = this.data.message || this.message; // Use injected message if available
}
closeDialog() {
  this.dialogRef.close(); 
}
}
