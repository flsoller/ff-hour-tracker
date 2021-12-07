import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from './button/button.directive';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';

@NgModule({
  declarations: [ButtonDirective, DropdownComponent, ClickOutsideDirective],
  imports: [CommonModule, FontAwesomeModule],
  exports: [ButtonDirective, DropdownComponent, ClickOutsideDirective],
})
export class SharedModule {}
