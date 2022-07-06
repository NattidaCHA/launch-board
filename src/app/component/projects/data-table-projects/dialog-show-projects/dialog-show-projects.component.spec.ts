import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowProjectsComponent } from './dialog-show-projects.component';

describe('DialogShowProjectsComponent', () => {
  let component: DialogShowProjectsComponent;
  let fixture: ComponentFixture<DialogShowProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogShowProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShowProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
