import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSearchFilter } from './management-search-filter';

describe('ManagementSearchFilter', () => {
  let component: ManagementSearchFilter;
  let fixture: ComponentFixture<ManagementSearchFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSearchFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementSearchFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
