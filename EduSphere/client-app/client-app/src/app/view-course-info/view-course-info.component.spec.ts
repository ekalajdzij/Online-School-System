import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseInfoComponent } from './view-course-info.component';

describe('ViewCourseInfoComponent', () => {
  let component: ViewCourseInfoComponent;
  let fixture: ComponentFixture<ViewCourseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCourseInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCourseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
