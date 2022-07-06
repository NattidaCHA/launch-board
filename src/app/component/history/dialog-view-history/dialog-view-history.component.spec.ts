import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewHistoryComponent } from './dialog-view-history.component';

describe('DialogViewHistoryComponent', () => {
  let component: DialogViewHistoryComponent;
  let fixture: ComponentFixture<DialogViewHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
