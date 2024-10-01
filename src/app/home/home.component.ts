import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { BrowserService } from '../browser.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbar, MatToolbarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private cdRef: ChangeDetectorRef) { }
  public browserService = inject(BrowserService);

  goHome() {
    this.browserService.goToPage('https://unilasalle.fr');
    this.cdRef.detectChanges();
  }
}
