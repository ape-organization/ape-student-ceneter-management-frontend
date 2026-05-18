import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSmsHistory } from './management-sms-history';

describe('ManagementSmsHistory', () => {
  let component: ManagementSmsHistory;
  let fixture: ComponentFixture<ManagementSmsHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSmsHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementSmsHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
