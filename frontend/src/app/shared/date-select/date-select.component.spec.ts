import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSelectComponent } from './date-select.component';

describe('DateSelectComponent', () => {
  let component: DateSelectComponent;
  let fixture: ComponentFixture<DateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getYears', () => {
    it('should return array of years', () => {
      jest.useFakeTimers().setSystemTime(new Date(2015, 1, 1).getTime());
      const expected = ['2015', '2014', '2013', '2012', '2011'];
      expect(component.getYears()).toStrictEqual(expected);
      jest.useRealTimers();
    });
  });
});
