import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomCaptureComponent } from './dom-capture.component';

describe('DomCaptureComponent', () => {
  let component: DomCaptureComponent;
  let fixture: ComponentFixture<DomCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomCaptureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
