import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTeacherComponent } from '../add-teacher-component/add-teacher.component';
import { ExportService } from '../../../Services/export.service';
import { TeacherService } from '../../../Services/teacher.service'; // Assuming this path is correct
import { Teacher } from '../../../models';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../../Services/notification.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-teacher-management-component',
  standalone: true,
  imports: [
    MaterialModule,
    TranslateModule,
    CommonModule,
    MatDialogModule, // Needed for MatDialog
    MatButtonModule, // For buttons
    MatIconModule,   // For icons
    MatMenuModule,   // For export menu
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './teacher-management-component.html',
  styleUrl: './teacher-management-component.scss',
})
export class TeacherManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<Teacher>([]);
  
  // Define columns dynamically, similar to SubjectManagementComponent
  columns = [
    { columnDef: 'name', header: 'TEACHER_MANAGEMENT.NAME', 
      cell: (element: any) => element.name },
    { columnDef: 'phone', header: 'TEACHER_MANAGEMENT.PHONE', 
      cell: (element: any) => element.phone },
    { columnDef: 'email', header: 'TEACHER_MANAGEMENT.EMAIL', cell: (element: any) => element.email || 'N/A' },
    { columnDef: 'subject', header: 'TEACHER_MANAGEMENT.SUBJECT', cell: (element: any) => element.subject },
    { columnDef: 'salary', header: 'TEACHER_MANAGEMENT.SALARY', cell: (element: any) => element.salary },
    { columnDef: 'status', header: 'TEACHER_MANAGEMENT.STATUS', cell: (element: any) => (element.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') },
    { columnDef: 'actions', header: 'COMMON.ACTIONS', cell: (element: any) => '' },
  ];

  displayedColumns: string[] = this.columns.map(c => c.columnDef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private exportService: ExportService,
    private teacherService: TeacherService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  async loadTeachers() {
    try {
      const teachers: any[] = await this.teacherService.getAll();
      this.dataSource.data = teachers;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
    //  this.notificationService.showError('Failed to load teachers');
    }
  }

  openAddTeacherDialog(teacher?: Teacher) {
    const dialogRef = this.dialog.open(AddTeacherComponent, {
     width: '800px',
     height:'auto',
    maxWidth: 'none',
      data: teacher ? { ...teacher } : {}, // Pass a copy for editing, or empty object for adding
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          if (teacher && teacher.id) {
            await this.teacherService.update(teacher.id, result);
           // this.notificationService.showSuccess('Teacher updated successfully');
          } else {
            await this.teacherService.create(result);
           // this.notificationService.showSuccess('Teacher added successfully');
          }
          this.loadTeachers();
        } catch (error) {
         // this.notificationService.showError('Operation failed');
        }
      }
    });
  }

  async deleteTeacher(teacher: Teacher) {
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      try {
        if (teacher.id) {
          await this.teacherService.delete(teacher.id);
         // this.notificationService.showSuccess('Teacher deleted successfully');
          this.loadTeachers();
        }
      } catch (error) {
       // this.notificationService.showError('Failed to delete teacher');
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

  exportPDF() {
    const data = this.dataSource.data.map(t => [t.name, t.phone, t.subject, t.salary, t.isActive ? 'Active' : 'Inactive']);
    this.exportService.exportPDF(data, "Teachers");
  }

  exportExcel() {
    const data = this.dataSource.data.map(t => ({
      Name: t.name,
      Phone: t.phone,
      Email: t.email,
      Subject: t.subject,
      Salary: t.salary,
      Status: t.isActive ? 'Active' : 'Inactive'
    }));
    this.exportService.exportExcel(data, "Teachers");
  }
}
