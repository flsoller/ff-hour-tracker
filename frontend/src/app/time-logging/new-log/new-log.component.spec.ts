import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLogComponent } from './new-log.component';

describe('NewLogComponent', () => {
  let component: NewLogComponent;
  let fixture: ComponentFixture<NewLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewLogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
