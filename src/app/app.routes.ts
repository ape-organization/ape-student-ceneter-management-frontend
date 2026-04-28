import { Routes } from '@angular/router';
import { LoginComponent } from './components/Auth/login/login';
import { RegisterComponent } from './components/Auth/register/register';
import { BaseLayoutComponent } from './components/Shared/Layout/base-layout-component/base-layout-component';
import { DashBoardComponent } from './components/Dashboard/dash-board-component/dash-board-component';
import { TeacherManagementComponent } from './components/Teacher_Management/teacher-management-component/teacher-management-component';
import { SubjectManagementComponent } from './components/Subject_Management/Subject_Management/subject-management-component';
import { LocationManagementComponent } from './components/Location_Management/Location_Management/location-management-component';
import { CLassManagementComponent } from './components/Class_Management/class-management-component/class-management-component';
import { StudentManagementComponent } from './components/Student_Management/student-management-component/student-management-component';
import { CardGeneratorComponent } from './components/BarCode_Management/card-generator-component/card-generator-component';
import { UserProfileComponent } from './components/Shared/User/user-profile-component/user-profile-component';
import { SmsCenterComponent } from './components/Messages/SMS_Management/sms-center.component';
import { WhatsappCenterComponent } from './components/Messages/Whatsapp_Management/whatsapp-center.component';
import { ScanAttendanceComponent } from './components/Attendance/ScanAttendance_Management/scan-attendance.component';

export const routes: Routes = [
  // Auth pages
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },

  // Main layout with children
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: '', component: DashBoardComponent },
      { path: 'SMS_Center', component: SmsCenterComponent },
      { path: 'Whatsapp_Center', component: WhatsappCenterComponent },
      { path: 'Scan_Attendance', component: ScanAttendanceComponent },
      { path: 'barcode_management', component: CardGeneratorComponent },
      { path: 'Teachers_Management', component: TeacherManagementComponent },
      { path: 'Location_Management', component: LocationManagementComponent },
      { path: 'Subject_Management', component: SubjectManagementComponent },
      { path: 'Student_Management', component: StudentManagementComponent },
      { path: 'Class_Management', component: CLassManagementComponent },
      { path: 'profile', component: UserProfileComponent }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];