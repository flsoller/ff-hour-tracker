import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[app-button]',
})
export class ButtonDirective implements OnInit {
  @Input() buttonType: string = '';

  @HostBinding('class') btnClasses: string = '';

  ngOnInit(): void {
    this.btnClasses = this.setModifiers();
  }

  setModifiers(): string {
    switch (this.buttonType) {
      case 'neo':
        return 'button button--icon-button-lg';

      case 'dropdown':
        return 'button button--dropdown-button';

      default:
        return 'button';
    }
  }
}
