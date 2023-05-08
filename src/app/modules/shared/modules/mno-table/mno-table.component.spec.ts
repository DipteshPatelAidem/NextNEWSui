import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZircaTableComponent } from './zirca-table.component';

describe('ZircaTableComponent', () => {
  let component: ZircaTableComponent;
  let fixture: ComponentFixture<ZircaTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZircaTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZircaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
