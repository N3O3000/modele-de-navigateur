import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call goHome method when home button is clicked', () => {
    spyOn(component, 'goHome'); // Crée une "espionne" (spy) sur la méthode goHome

    // Trouver le bouton dans le DOM et simuler un clic
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    // Vérifier que la méthode goHome a été appelée lors du clic
    expect(component.goHome).toHaveBeenCalled();
  });
});
