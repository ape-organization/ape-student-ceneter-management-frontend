import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material/material-module';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Location } from '../../../models';
import { AddLocationComponent } from '../add-location-component/add-location-component';
import { ExportService } from '../../../Services/export.service';
import { LocationService } from '../../../Services/location.service';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-location-management-component',
  standalone: true,
  imports: [MaterialModule, TranslateModule, CommonModule, MatDialogModule],
  templateUrl: './location-management-component.html',
  styleUrl: './location-management-component.scss',
})
export class LocationManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<Location>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns = [
    { columnDef: 'branch', header: 'LOCATION_MANAGEMENT.BRANCH_LABEL', cell: (element: any) => element.branch },
    { columnDef: 'classroom', header: 'LOCATION_MANAGEMENT.CLASSROOM_LABEL', cell: (element: any) => element.classroom },
    { columnDef: 'capacity', header: 'LOCATION_MANAGEMENT.CAPACITY_LABEL', cell: (element: any) => element.capacity },
    { columnDef: 'status', header: 'LOCATION_MANAGEMENT.STATUS_LABEL', cell: (element: any) => (element.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') },
    { columnDef: 'actions', header: 'COMMON.ACTIONS', cell: () => '' },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);
  showExportMenu = false;

  constructor(
    private dialog: MatDialog,
    private locationService: LocationService,
    private exportService: ExportService,
    private notificationService: NotificationService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  async loadLocations() {
    try {
      const locations: Location[] = await this.locationService.getAll();
      this.dataSource.data = locations;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      // Error handling
    }
  }

  openAddLocationDialog(location?: Location) {
    const dialogRef = this.dialog.open(AddLocationComponent, {
      width: '700px',
      data: location ? { ...location } : {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          if (location && location.id) {
            await this.locationService.update(location.id, result);
          } else {
            await this.locationService.create(result);
          }
          this.loadLocations();
        } catch (error) {
          // Error handling
        }
      }
    });
  }

  async deleteLocation(location: Location) {
    if (confirm(`Are you sure you want to delete ${location.classroom}?`)) {
      try {
        if (location.id) {
          await this.locationService.delete(location.id);
          this.loadLocations();
        }
      } catch (error) {
        // Error handling
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
    const data = this.dataSource.data.map(t => [t.branch, t.classroom, t.capacity,
        t.isActive ? 'Active' : 'Inactive']);
    this.exportService.exportPDF(data, "Teachers");
  }

  exportExcel() {
    const data = this.dataSource.data.map(t => ({
      Branch: t.branch,
      ClassRoom: t.classroom,
      Capacity: t.capacity,
      Status: t.isActive ? 'Active' : 'Inactive'
    }));
    this.exportService.exportExcel(data, "Teachers");
  
   
  }
}
