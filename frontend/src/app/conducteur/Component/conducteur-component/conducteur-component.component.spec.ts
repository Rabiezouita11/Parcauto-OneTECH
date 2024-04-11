import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConducteurComponentComponent } from './conducteur-component.component';

describe('ConducteurComponentComponent', () => {
  let component: ConducteurComponentComponent;
  let fixture: ComponentFixture<ConducteurComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConducteurComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConducteurComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
