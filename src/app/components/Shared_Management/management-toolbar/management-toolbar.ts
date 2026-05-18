import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-management-toolbar',
  imports: [CommonModule, MaterialModule, TranslateModule],
  templateUrl: './management-toolbar.html',
  styleUrl: './management-toolbar.scss',
})
export class ManagementToolbar {
  @Input() title = '';
  @Input() icon = '';
  @Input() addButtonText = '';

  @Output() add = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();
  @Output() exportExcel = new EventEmitter<void>();
}
