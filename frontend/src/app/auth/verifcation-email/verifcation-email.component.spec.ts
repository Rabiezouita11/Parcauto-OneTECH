import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifcationEmailComponent } from './verifcation-email.component';

describe('VerifcationEmailComponent', () => {
  let component: VerifcationEmailComponent;
  let fixture: ComponentFixture<VerifcationEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifcationEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifcationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
