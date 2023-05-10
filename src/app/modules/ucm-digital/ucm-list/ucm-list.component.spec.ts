import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcmListComponent } from './ucm-list.component';

describe('UcmListComponent', () => {
  let component: UcmListComponent;
  let fixture: ComponentFixture<UcmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcmListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
