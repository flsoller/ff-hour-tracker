import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from './button/button.directive';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { DateSelectComponent } from './date-select/date-select.component';

@NgModule({
  declarations: [
    ButtonDirective,
    DropdownComponent,
    ClickOutsideDirective,
    DateSelectComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FontAwesomeModule],
  exports: [
    ButtonDirective,
    DropdownComponent,
    ClickOutsideDirective,
    DateSelectComponent,
  ],
})
export class SharedModule {}
