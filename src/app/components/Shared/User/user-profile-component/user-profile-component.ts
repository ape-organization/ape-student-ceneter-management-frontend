import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material/material-module';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../../../Users/edit-user-component/edit-user-component';

@Component({
  selector: 'app-user-profile-component',
  imports: [MaterialModule],
  templateUrl: './user-profile-component.html',
  styleUrl: './user-profile-component.scss',
})
export class UserProfileComponent {
  constructor(private dialog: MatDialog) {}
editUser() {
 this.dialog.open(EditUserComponent, {
    width: '600px'
  });
}
}
