import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsambleComponent } from './ansamble.component';

describe('AnsambleComponent', () => {
  let component: AnsambleComponent;
  let fixture: ComponentFixture<AnsambleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnsambleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnsambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
