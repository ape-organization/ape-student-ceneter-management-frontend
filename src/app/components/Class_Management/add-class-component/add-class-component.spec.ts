import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassComponent } from './add-class-component';

describe('AddClassComponent', () => {
  let component: AddClassComponent;
  let fixture: ComponentFixture<AddClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClassComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
