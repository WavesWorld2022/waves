import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturesItemComponent } from './manufactures-item.component';

describe('ManufacturesItemComponent', () => {
  let component: ManufacturesItemComponent;
  let fixture: ComponentFixture<ManufacturesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturesItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
