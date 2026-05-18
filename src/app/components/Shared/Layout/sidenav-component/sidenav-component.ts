import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../../material/MaterialModule';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav-component',
  imports: [MaterialModule,RouterModule,TranslateModule,CommonModule],
  templateUrl: './sidenav-component.html',
  styleUrl: './sidenav-component.scss',
})
export class SidenavComponent {
  @Output() itemSelected = new EventEmitter<void>();
selectedItem = 'dashboard'; // default selected
isAttendanceExpanded: boolean = false;
isMessagesExpanded: boolean = false;
constructor(private router: Router) {}

selectItem(item: string) {
  this.selectedItem = item;
  // Ensure the route matches the string passed in the HTML
  this.router.navigate([`${item}`]);
   this.itemSelected.emit();
}
refreshPage(item: string) {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
     this.router.navigate([`${item}`]);
  });
}
}
