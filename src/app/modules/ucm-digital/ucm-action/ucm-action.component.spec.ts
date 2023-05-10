import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcmActionComponent } from './ucm-action.component';

describe('UcmActionComponent', () => {
  let component: UcmActionComponent;
  let fixture: ComponentFixture<UcmActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcmActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcmActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
