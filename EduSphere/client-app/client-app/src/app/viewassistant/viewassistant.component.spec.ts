import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewassistantComponent } from './viewassistant.component';

describe('ViewassistantComponent', () => {
  let component: ViewassistantComponent;
  let fixture: ComponentFixture<ViewassistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewassistantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewassistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
