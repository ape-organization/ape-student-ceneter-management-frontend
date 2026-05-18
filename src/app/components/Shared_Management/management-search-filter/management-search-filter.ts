import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';

@Component({
  selector: 'app-management-search-filter',
  imports: [CommonModule, MaterialModule],
  templateUrl: './management-search-filter.html',
  styleUrl: './management-search-filter.scss',
})
export class ManagementSearchFilter {
  @Input() placeholder = '';
  @Input() icon = 'search';

  @Output() search = new EventEmitter<any>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
