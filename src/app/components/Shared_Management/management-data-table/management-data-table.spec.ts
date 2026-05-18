import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDataTable } from './management-data-table';

describe('ManagementDataTable', () => {
  let component: ManagementDataTable;
  let fixture: ComponentFixture<ManagementDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementDataTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementDataTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
