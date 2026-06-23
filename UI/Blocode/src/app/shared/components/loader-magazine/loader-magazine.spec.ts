import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderMagazine } from './loader-magazine';

describe('LoaderMagazine', () => {
  let component: LoaderMagazine;
  let fixture: ComponentFixture<LoaderMagazine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderMagazine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderMagazine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
