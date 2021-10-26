import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from './button/button.directive';

@NgModule({
  declarations: [ButtonDirective],
  imports: [CommonModule],
  exports: [ButtonDirective],
})
export class SharedModule {}
