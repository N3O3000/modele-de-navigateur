import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-screenshot',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbar, MatToolbarModule],
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.css']
})
export class ScreenshotComponent {

  screenshotPath: string | null = null;

  constructor() {}

  captureScreen() {
    const electronAPI = (window as any).electronAPI;

    if (electronAPI && electronAPI.captureScreen) {
      electronAPI.captureScreen().then((filePath: string | null) => {
        if (filePath) {
          this.screenshotPath = filePath;
          alert(`Capture d'écran sauvegardée : ${filePath}`);
        } else {
          alert('La capture d\'écran a été annulée.');
        }
      }).catch((err: any) => {
        console.error('Erreur lors de la capture d’écran :', err);
      });
    } else {
      console.error('electronAPI ou captureScreen n\'est pas disponible.');
    }
  }
}