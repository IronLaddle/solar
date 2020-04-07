import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestmapComponent } from './testmap.component';

describe('TestmapComponent', () => {
  let component: TestmapComponent;
  let fixture: ComponentFixture<TestmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
