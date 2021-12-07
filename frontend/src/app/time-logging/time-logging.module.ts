import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeLoggingRoutingModule } from './time-logging-routing.module';
import { NewLogComponent } from './new-log/new-log.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [NewLogComponent],
  imports: [CommonModule, TimeLoggingRoutingModule, SharedModule],
})
export class TimeLoggingModule {}
