import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [DropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleDropdown', () => {
    it('should toggle dropdownOpen', () => {
      component.dropdownOpen = true;
      component.toggleDropdown();
      expect(component.dropdownOpen).toBe(false);
    });
  });

  describe('closeDropdown', () => {
    it('should set dropdownOpen to false', () => {
      component.dropdownOpen = true;
      component.closeDropdown();
      expect(component.dropdownOpen).toBe(false);
    });
  });

  describe('onSelectionChanged', () => {
    it('should emit selected item and toggle dropdown', () => {
      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');
      component.toggleDropdown = jest.fn();
      component.selectedItem = 'otherItem';

      component.onSelectionChanged('newItem');

      expect(component.selectedItem).toBe('newItem');
      expect(emitSpy).toHaveBeenCalledWith(component.selectedItem);
      expect(component.toggleDropdown).toBeCalledTimes(1);
    });
  });
});
