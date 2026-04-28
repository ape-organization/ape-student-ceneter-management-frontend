import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { TranslateModule } from '@ngx-translate/core';
import { ExportService } from '../../../Services/export.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSubjectComponent } from '../add-subject-component/add-subject-component';
import { SubjectService } from '../../../Services/subject.service'; // Assuming this path is correct
import { Subject } from '../../../models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-subject-management-component',
  standalone: true,
  imports: [MaterialModule, TranslateModule, CommonModule, MatDialogModule],
  templateUrl: './subject-management-component.html',
  styleUrl: './subject-management-component.scss',
})
export class SubjectManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<Subject>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private exportService: ExportService,
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private eRef: ElementRef
  ) {}

  columns = [
    { columnDef: 'name', header: 'SUBJECT_MANAGEMENT.NAME_LABEL', cell: (element: Subject) => element.name },
    { columnDef: 'status', header: 'SUBJECT_MANAGEMENT.STATUS_LABEL', cell: (element: Subject) => (element.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') },
    { columnDef: 'actions', header: 'COMMON.ACTIONS', cell: () => '' },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);
  showExportMenu = false;

  ngOnInit(): void {
    this.loadSubjects();
  }

  async loadSubjects() {
    try {
      const subjects: Subject[] = await this.subjectService.getAll();
      this.dataSource.data = subjects;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      // this.notificationService.showError('Failed to load subjects');
    }
  }

  openAddSubjectDialog(subject?: Subject) {
    const dialogRef = this.dialog.open(AddSubjectComponent, {
      width: '500px',
       height:'auto',
    maxWidth: 'none',
      data: subject ? { ...subject } : {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          if (subject && subject.id) {
            await this.subjectService.update(subject.id, result);
          } else {
            await this.subjectService.create(result);
          }
          this.loadSubjects();
        } catch (error) {
          // Handle error
        }
      }
    });
  }

  async deleteSubject(subject: Subject) {
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      try {
        if (subject.id) {
          await this.subjectService.delete(subject.id);
          this.loadSubjects();
        }
      } catch (error) {
        // Handle error
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
    const data = this.dataSource.data.map(s => [s.name, s.isActive ? 'Active' : 'Inactive']);
    this.exportService.exportPDF(data, "Subjects");
  }

  exportExcel() {
    const data = this.dataSource.data.map(s => ({
      Name: s.name,
      Status: s.isActive ? 'Active' : 'Inactive'
    }));
    this.exportService.exportExcel(data, "Subjects");
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.showExportMenu = false;
}
}