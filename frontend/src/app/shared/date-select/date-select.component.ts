import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss'],
})
export class DateSelectComponent {
  @Output() selectedDate = new EventEmitter<Date>();

  dateMonth: Date | null = null;

  dateYear: Date | null = null;

  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /**
   * Method to get 5 year range i.e. from 2018 - 2022
   * @returns Array of years as string[]
   */
  getYears(): string[] {
    const currentYear = new Date().getFullYear();
    const subYears = currentYear - 4;
    const years = [];

    for (var i = currentYear; i >= subYears; i--) {
      years.push(i.toString());
    }
    return years;
  }

  onMonthChanged() {}

  onYearChanged() {}
}
