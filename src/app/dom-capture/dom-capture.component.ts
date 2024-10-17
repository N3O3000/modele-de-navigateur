import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-dom-capture',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dom-capture.component.html',
  styleUrls: ['./dom-capture.component.css']
})
export class DomCaptureComponent {

  captureWebview() {
    const electronAPI = (window as any).electronAPI;

    // Appelle la méthode pour capturer la webview
    if (electronAPI && electronAPI.captureWebview) {
      electronAPI.captureWebview().then((imageBase64: string) => {
        if (imageBase64) {
          this.downloadImage(imageBase64, 'webview-capture.png');
        } else {
          alert('La capture a échoué.');
        }
      }).catch((error: any) => {
        console.error('Erreur lors de la capture de la webview :', error);
      });
    }
  }

  downloadImage(dataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}