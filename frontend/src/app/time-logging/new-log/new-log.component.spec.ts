import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLogComponent } from './new-log.component';

describe('NewLogComponent', () => {
  let component: NewLogComponent;
  let fixture: ComponentFixture<NewLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLogComponent ]
    })
    .compileComponents();
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
