import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSmsCompose } from './management-sms-compose';

describe('ManagementSmsCompose', () => {
  let component: ManagementSmsCompose;
  let fixture: ComponentFixture<ManagementSmsCompose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSmsCompose]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementSmsCompose);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
