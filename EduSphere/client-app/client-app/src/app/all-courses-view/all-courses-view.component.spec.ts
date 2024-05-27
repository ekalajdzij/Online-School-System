import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCoursesViewComponent } from './all-courses-view.component';

describe('AllCoursesViewComponent', () => {
  let component: AllCoursesViewComponent;
  let fixture: ComponentFixture<AllCoursesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllCoursesViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllCoursesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
