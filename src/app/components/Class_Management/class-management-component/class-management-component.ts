import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ExportService } from '../../../Services/export.service';
import { ClassService } from '../../../Services/class.service';
import { TeacherService } from '../../../Services/teacher.service';
import { LocationService } from '../../../Services/location.service';
import { ClassModel, Teacher, Location } from '../../../models';
import { AddClassComponent } from '../add-class-component/add-class-component';

@Component({
  selector: 'app-class-management-component',
  standalone: true,
  imports: [MaterialModule, TranslateModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './class-management-component.html',
  styleUrl: './class-management-component.scss',
})
export class CLassManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<ClassModel>([]);
  teachers: any[] = [];
  locations: Location[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private exportService: ExportService,
    private classService: ClassService,
    private teacherService: TeacherService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private eRef: ElementRef
  ) { }

  columns = [
    { columnDef: 'name', header: 'CLASS_MANAGEMENT.CLASS_NAME', cell: (element: any) => element.name },
    { columnDef: 'teacher', header: 'CLASS_MANAGEMENT.TEACHER', cell: (element: any) => this.getTeacherName(element.teacherId) },
    { columnDef: 'location', header: 'CLASS_MANAGEMENT.LOCATION', cell: (element: any) => this.getLocationLabel(element.locationId) },
    { columnDef: 'schedule', header: 'CLASS_MANAGEMENT.DURATION', cell: (element: any) => `${element.dayFrom} - ${element.dayTo} (${element.hourFrom} - ${element.hourTo})` },
    { columnDef: 'price', header: 'CLASS_MANAGEMENT.PRICE_PER_STUDENT', cell: (element: any) => element.price },
    { columnDef: 'totalPrice', header: 'CLASS_MANAGEMENT.TOTAL_PRICE', cell: (element: any) => element.totalPrice },
    { columnDef: 'status', header: 'CLASS_MANAGEMENT.STATUS', cell: (element: any) => (element.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') },
    { columnDef: 'actions', header: 'COMMON.ACTIONS', cell: (element: any) => '' },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);
  showExportMenu = false;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    try {
      const [classes, teachers, locations] = await Promise.all([
        this.classService.getAll(),
        this.teacherService.getAll(),
        this.locationService.getAll()
      ]);
      this.teachers = teachers;
      this.locations = locations;
      this.dataSource.data = classes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Failed to load data', error);
    }
  }

  getTeacherName(id: number): string {
    return this.teachers.find(t => t.id === id)?.name || 'N/A';
  }

  getLocationLabel(id: number): string {
    const loc = this.locations.find(l => l.id === id);
    return loc ? `${loc.branch} - ${loc.classroom}` : 'N/A';
  }

  openAddClassDialog(item?: ClassModel) {
    const dialogRef = this.dialog.open(AddClassComponent, {
      width: '800px',
       height:'auto',
    maxWidth: 'none',
      data: item ? { ...item } : {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          if (item && item.id) {
            await this.classService.update(item.id, result);
          } else {
            await this.classService.create(result);
          }
          this.loadData();
        } catch (error: any) {
          alert(error.message || 'Operation failed');
        }
      }
    });
  }

  async deleteClass(item: ClassModel) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        if (item.id) {
          await this.classService.delete(item.id);
          this.loadData();
        }
      } catch (error) {
        console.error('Failed to delete class', error);
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleExportMenu(event: Event) {
    event.stopPropagation();
    this.showExportMenu = !this.showExportMenu;
  }

  exportPDF() {
    const data = this.dataSource.data.map(c => [
      c.name, this.getTeacherName(c.teacherId), this.getLocationLabel(c.locationId), c.totalPrice, c.isActive ? 'Active' : 'Inactive'
    ]);
    this.exportService.exportPDF(data, "Classes");
  }

  exportExcel() {
    const data = this.dataSource.data.map(c => ({
      Name: c.name,
      Teacher: this.getTeacherName(c.teacherId),
      Location: this.getLocationLabel(c.locationId),
      TotalPrice: c.totalPrice,
      Status: c.isActive ? 'Active' : 'Inactive'
    }));
    this.exportService.exportExcel(data, "Classes");
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.showExportMenu = false;
  }
}
