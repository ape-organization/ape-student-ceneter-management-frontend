import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material/MaterialModule';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Student } from '../../../models';
import { AddStudentComponent } from '../add-student-component/add-student-component';
import { StudentService } from '../../../Services/student.service';
import { ExportService } from '../../../Services/export.service';
import { ManagementToolbar } from '../../Shared_Management/management-toolbar/management-toolbar';
import { ManagementSearchFilter } from '../../Shared_Management/management-search-filter/management-search-filter';
import { ManagementDataTable } from '../../Shared_Management/management-data-table/management-data-table';

@Component({
  selector: 'app-student-management-component',
  standalone: true,
  imports: [MaterialModule, TranslateModule, CommonModule,
    ManagementToolbar,ManagementSearchFilter,ManagementDataTable
  ],
  templateUrl: './student-management-component.html',
  styleUrl: './student-management-component.scss',
})
export class StudentManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  showExportMenu = false;

  columns = [
    { columnDef: 'name', header: 'STUDENT_MANAGEMENT.NAME', cell: (element: Student) => element.name },
    { columnDef: 'phone', header: 'STUDENT_MANAGEMENT.PHONE', cell: (element: Student) => element.phone },
    { columnDef: 'parentPhone', header: 'STUDENT_MANAGEMENT.PARENT_PHONE', cell: (element: Student) => element.parentPhone },
    { columnDef: 'grade', header: 'STUDENT_MANAGEMENT.GRADE', cell: (element: Student) => element.grade },
    { columnDef: 'discount', header: 'STUDENT_MANAGEMENT.DISCOUNT', cell: (element: Student) => `${element.discount}%` },
    { columnDef: 'status', header: 'STUDENT_MANAGEMENT.STATUS', cell: (element: Student) => (element.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') },
    { columnDef: 'actions', header: 'COMMON.ACTIONS', cell: () => '' },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService,
        private exportService: ExportService,
    
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async loadStudents() {
    try {
      const students: Student[] = await this.studentService.getAll();
      this.dataSource.data = students;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Failed to load students', error);
    }
  }

  openAddStudentDialog(student?: Student) {
    const dialogRef = this.dialog.open(AddStudentComponent, {
      width: '800px',
       height:'auto',
    maxWidth: 'none',
      data: student ? { ...student } : {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          if (student && student.id) {
            await this.studentService.update(student.id, result);
          } else {
            await this.studentService.create(result);
          }
          this.loadStudents();
        } catch (error) {
          console.error('Operation failed', error);
        }
      }
    });
  }

  async deleteStudent(student: any) {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        if (student.id) {
          await this.studentService.delete(student.id);
          this.loadStudents();
        }
      } catch (error) {
        console.error('Failed to delete student', error);
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.showExportMenu = false;
  }
   exportPDF() {
    const data = this.dataSource.data.map(s => [s.name, s.phone, s.parentPhone, s.grade, `${s.discount}%`, s.isActive ? 'Active' : 'Inactive']);
    this.exportService.exportPDF(data, "Students");
  }

  exportExcel() {
    const data = this.dataSource.data.map(s => ({
      Name: s.name,
      Phone: s.phone,
      ParentPhone: s.parentPhone, // Corrected property name
      Grade: s.grade,
      Discount: `${s.discount}%`,
      Status: s.isActive ? 'Active' : 'Inactive'
    }));
    this.exportService.exportExcel(data, "Students");
  }
}