import { Component, inject, ChangeDetectorRef} from '@angular/core';
import { BrowserService } from '../browser.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-backward',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './backward.component.html',
  styleUrl: './backward.component.css'
})
export class BackwardComponent {

  constructor(private cdRef: ChangeDetectorRef) { }
  public browserService = inject(BrowserService);

  onUrlchange(){
    this.cdRef.detectChanges();
  }

}
