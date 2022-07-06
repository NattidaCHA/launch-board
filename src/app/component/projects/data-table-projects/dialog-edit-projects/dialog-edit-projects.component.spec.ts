import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditProjectsComponent } from './dialog-edit-projects.component';

describe('DialogEditProjectsComponent', () => {
  let component: DialogEditProjectsComponent;
  let fixture: ComponentFixture<DialogEditProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
