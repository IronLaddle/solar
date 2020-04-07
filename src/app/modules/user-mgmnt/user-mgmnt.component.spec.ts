import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgmntComponent } from './user-mgmnt.component';

describe('UserMgmntComponent', () => {
  let component: UserMgmntComponent;
  let fixture: ComponentFixture<UserMgmntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMgmntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMgmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
