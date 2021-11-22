import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(
        (module) => module.DashboardModule
      ),
  },
  {
    path: 'config',
    loadChildren: () =>
      import('./configuration/configuration.module').then(
        (module) => module.ConfigurationModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((module) => module.ReportsModule),
  },
  {
    path: 'timelog',
    loadChildren: () =>
      import('./time-logging/time-logging.module').then(
        (module) => module.TimeLoggingModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        (module) => module.UserManagementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
