import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { BrowserService } from '../browser.service';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-refresh',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './refresh.component.html',
  styleUrl: './refresh.component.css'
})
export class RefreshComponent {

  constructor(private cdRef: ChangeDetectorRef) { }
  public browserService = inject(BrowserService);

  onUrlchange(){
    this.cdRef.detectChanges();
  }
}
