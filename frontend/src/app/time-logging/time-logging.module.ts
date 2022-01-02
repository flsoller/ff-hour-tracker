import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeLoggingRoutingModule } from './time-logging-routing.module';
import { NewLogComponent } from './new-log/new-log.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [NewLogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, TimeLoggingRoutingModule, SharedModule],
})
export class TimeLoggingModule {}
