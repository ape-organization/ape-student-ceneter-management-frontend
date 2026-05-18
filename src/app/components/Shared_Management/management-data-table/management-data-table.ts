import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material/MaterialModule';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-management-data-table',
  imports: [ CommonModule,
    MaterialModule,
    TranslateModule],
  templateUrl: './management-data-table.html',
  styleUrl: './management-data-table.scss',
})
export class ManagementDataTable {
 @Input() dataSource!: MatTableDataSource<any>;

  @Input() columns: any[] = [];

  @Input() displayedColumns: string[] = [];

  @Output() edit = new EventEmitter<any>();

  @Output() delete = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
