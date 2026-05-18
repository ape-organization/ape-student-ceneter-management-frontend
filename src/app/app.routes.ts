import { Routes } from '@angular/router';

export const routes: Routes = [
  // Auth pages
  {
    path: 'signin',
    loadComponent: () =>
      import('./components/Auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/Auth/register/register')
        .then(m => m.RegisterComponent)
  },

  // Main layout
  {
    path: '',
    loadComponent: () =>
      import('./components/Shared/Layout/base-layout-component/base-layout-component')
        .then(m => m.BaseLayoutComponent),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/Dashboard/dash-board-component/dash-board-component')
            .then(m => m.DashBoardComponent)
      },

      {
        path: 'SMS_Center',
        loadComponent: () =>
          import('./components/Messages/SMS_Management/sms-center.component')
            .then(m => m.SmsCenterComponent)
      },

      {
        path: 'SMS_Templates',
        loadComponent: () =>
          import('./components/Messages/sms-templates/sms-templates.component')
            .then(m => m.SmsTemplatesComponent)
      },

      {
        path: 'Whatsapp_Center',
        loadComponent: () =>
          import('./components/Messages/Whatsapp_Management/whatsapp-center.component')
            .then(m => m.WhatsappCenterComponent)
      },

      {
        path: 'Scan_Attendance',
        loadComponent: () =>
          import('./components/Attendance/ScanAttendance_Management/scan-attendance.component')
            .then(m => m.ScanAttendanceComponent)
      },

      {
        path: 'barcode_management',
        loadComponent: () =>
          import('./components/BarCode_Management/card-generator-component/card-generator-component')
            .then(m => m.CardGeneratorComponent)
      },

      {
        path: 'Teachers_Management',
        loadComponent: () =>
          import('./components/Teacher_Management/teacher-management-component/teacher-management-component')
            .then(m => m.TeacherManagementComponent)
      },

      {
        path: 'Location_Management',
        loadComponent: () =>
          import('./components/Location_Management/Location_Management/location-management-component')
            .then(m => m.LocationManagementComponent)
      },

      {
        path: 'Subject_Management',
        loadComponent: () =>
          import('./components/Subject_Management/Subject_Management/subject-management-component')
            .then(m => m.SubjectManagementComponent)
      },

      {
        path: 'Student_Management',
        loadComponent: () =>
          import('./components/Student_Management/student-management-component/student-management-component')
            .then(m => m.StudentManagementComponent)
      },

      {
        path: 'Class_Management',
        loadComponent: () =>
          import('./components/Class_Management/class-management-component/class-management-component')
            .then(m => m.CLassManagementComponent)
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./components/Shared/User/user-profile-component/user-profile-component')
            .then(m => m.UserProfileComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];