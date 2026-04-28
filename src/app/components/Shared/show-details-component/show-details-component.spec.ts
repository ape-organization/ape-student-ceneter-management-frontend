import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetailsComponent } from './show-details-component';

describe('ShowDetailsComponent', () => {
  let component: ShowDetailsComponent;
  let fixture: ComponentFixture<ShowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
