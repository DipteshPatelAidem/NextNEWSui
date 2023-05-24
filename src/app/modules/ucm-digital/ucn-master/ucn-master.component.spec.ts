import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcnMasterComponent } from './ucn-master.component';

describe('UcnMasterComponent', () => {
  let component: UcnMasterComponent;
  let fixture: ComponentFixture<UcnMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcnMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcnMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
