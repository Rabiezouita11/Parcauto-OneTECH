import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBoxComponent } from './list-box.component';

describe('ListBoxComponent', () => {
  let component: ListBoxComponent;
  let fixture: ComponentFixture<ListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
