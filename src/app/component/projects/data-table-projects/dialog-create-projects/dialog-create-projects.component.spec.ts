import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateProjectsComponent } from './dialog-create-projects.component';

describe('DialogCreateProjectsComponent', () => {
  let component: DialogCreateProjectsComponent;
  let fixture: ComponentFixture<DialogCreateProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCreateProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
