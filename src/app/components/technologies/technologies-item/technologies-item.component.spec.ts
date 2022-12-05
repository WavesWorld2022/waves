import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologiesItemComponent } from './technologies-item.component';

describe('TechnologiesItemComponent', () => {
  let component: TechnologiesItemComponent;
  let fixture: ComponentFixture<TechnologiesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnologiesItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
