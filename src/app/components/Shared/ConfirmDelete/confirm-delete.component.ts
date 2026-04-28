import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports:[MaterialModule],
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent {
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
