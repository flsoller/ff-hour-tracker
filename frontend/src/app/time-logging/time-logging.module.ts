import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeLoggingRoutingModule } from './time-logging-routing.module';
import { NewLogComponent } from './new-log/new-log.component';


@NgModule({
  declarations: [
    NewLogComponent
  ],
  imports: [
    CommonModule,
    TimeLoggingRoutingModule
  ]
})
export class TimeLoggingModule { }
