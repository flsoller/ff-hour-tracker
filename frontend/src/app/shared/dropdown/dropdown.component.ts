import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() label: string = 'label';

  @Input() listItems: string[] = [];

  @Output() selectionChanged = new EventEmitter<string>();

  selectedItem = '';

  faCaretSquareDown = faCaretSquareDown;

  dropdownOpen = false;

  // Open/Close dropdown
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Click handler used in combination with appClickOutside directive
  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  /**
   * Sets and emits selected value, closes dropdown
   * @param item The item selected from the list
   */
  onSelectionChanged(item: string): void {
    this.selectedItem = item;
    this.selectionChanged.emit(item);
    this.toggleDropdown();
  }
}
