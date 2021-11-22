import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLogComponent } from './new-log/new-log.component';

const routes: Routes = [
  {
    path: '',
    component: NewLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeLoggingRoutingModule {}
