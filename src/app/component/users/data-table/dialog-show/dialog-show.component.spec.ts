import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowComponent } from './dialog-show.component';

describe('DialogShowComponent', () => {
  let component: DialogShowComponent;
  let fixture: ComponentFixture<DialogShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
