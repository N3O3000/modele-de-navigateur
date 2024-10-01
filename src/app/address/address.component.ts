import { Component, ElementRef, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BrowserService } from '../browser.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [MatIconModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  @ViewChild('search') searchElement: ElementRef = new ElementRef({});

  constructor(private cdRef: ChangeDetectorRef) { }
  public browserService = inject(BrowserService);

  onKeyDownEvent(e: any) {
    if (e.key === 'Escape') {
      e.currentTarget.blur();
      this.browserService.setToCurrentUrl();
    } else if (e.key === 'Enter') {
      const value = e.currentTarget.value;
      e.currentTarget.blur();
      this.goToPage(value);
    }
    this.cdRef.detectChanges();
  }

  onMouseDown(e: any) {
    this.searchElement.nativeElement.select();
    this.cdRef.detectChanges();
  };

  goToPage(url: string) {
    this.browserService.goToPage(url);
    this.cdRef.detectChanges();
  }

  onUrlChange(){
    this.cdRef.detectChanges();
    //this.browserService.onUrlChange();
  }
}
