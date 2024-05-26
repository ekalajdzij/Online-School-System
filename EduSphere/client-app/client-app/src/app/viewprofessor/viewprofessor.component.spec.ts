import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfessorComponent } from './viewprofessor.component';

describe('ViewprofessorComponent', () => {
  let component: ViewProfessorComponent;
  let fixture: ComponentFixture<ViewProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewProfessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
