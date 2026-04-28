import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLassManagementComponent } from './class-management-component';

describe('CLassManagementComponent', () => {
  let component: CLassManagementComponent;
  let fixture: ComponentFixture<CLassManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLassManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLassManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
