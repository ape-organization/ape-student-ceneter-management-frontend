import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSmsSummary } from './management-sms-summary';

describe('ManagementSmsSummary', () => {
  let component: ManagementSmsSummary;
  let fixture: ComponentFixture<ManagementSmsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSmsSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementSmsSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
