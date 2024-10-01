import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { BrowserService } from '../browser.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.css'
})
export class DebugComponent {
  constructor(private cdRef: ChangeDetectorRef) { }
  public browserService = inject(BrowserService);

  onUrlchange(){
    this.cdRef.detectChanges();
  }

}
