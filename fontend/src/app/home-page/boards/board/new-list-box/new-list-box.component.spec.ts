import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewListBoxComponent } from './new-list-box.component';

describe('NewListBoxComponent', () => {
  let component: NewListBoxComponent;
  let fixture: ComponentFixture<NewListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewListBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
