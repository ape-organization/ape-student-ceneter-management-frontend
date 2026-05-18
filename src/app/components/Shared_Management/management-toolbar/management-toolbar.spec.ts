import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementToolbar } from './management-toolbar';

describe('ManagementToolbar', () => {
  let component: ManagementToolbar;
  let fixture: ComponentFixture<ManagementToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
