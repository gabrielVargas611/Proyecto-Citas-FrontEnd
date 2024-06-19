import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionesComponent } from './programaciones.component';

describe('ProgramacionesComponent', () => {
  let component: ProgramacionesComponent;
  let fixture: ComponentFixture<ProgramacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
