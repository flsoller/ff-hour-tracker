import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  selector: 'click-outside-test-comp',
  template: `
    <div class="outside">
      <div
        class="inside"
        appClickOutside
        (outsideElClick)="toggleClick($event)"></div>
    </div>
  `,
})
class TestComponent {
  clicked = false;
  toggleClick() {
    this.clicked = !this.clicked;
  }
}

describe('ClickOutsideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let insideEl: DebugElement;
  let outsideEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ClickOutsideDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    insideEl = fixture.debugElement.query(By.css('.inside'));
    outsideEl = fixture.debugElement.query(By.css('.outside'));
  });

  it('should create an instance', () => {
    const directive = new ClickOutsideDirective(insideEl);
    expect(directive).toBeTruthy();
  });

  it('should emit when clicking outside the element', () => {
    outsideEl.nativeElement.click();
    expect(component.clicked).toBe(true);
  });
});
