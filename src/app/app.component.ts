import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { BackwardComponent } from './backward/backward.component';
import { DebugComponent } from './debug/debug.component';
import { ForwardComponent } from './forward/forward.component';
import { RefreshComponent } from './refresh/refresh.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomeComponent } from './home/home.component';
import { ScreenshotComponent } from './screenshot/screenshot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatToolbarModule, 
    AddressComponent, 
    BackwardComponent, 
    DebugComponent, 
    ForwardComponent, 
    RefreshComponent, 
    HomeComponent,
    ScreenshotComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Correction ici
})
export class AppComponent {
  title = 'CookiesViz';
}
