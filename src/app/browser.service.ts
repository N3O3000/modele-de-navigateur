import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  url = 'https://unimakers.fr';
  canGoBack = false;
  canGoForward = false;

// @ts-ignore
  electronAPI = window.electronAPI;
  constructor(){
    const that = this;
    function onUrlChange(url : string){  
      that.url = url;
    }
    this.electronAPI.onUrlChange(onUrlChange);
    
  }

   toogleDevTool() {
    this.electronAPI.toogleDevTool();
    //this.electronAPI.onUrlchange()
  }

  goBack() {
    this.electronAPI.goBack();
    this.updateHistory();
    //this.electronAPI.onUrlchange()
  }

  goForward() {
    this.electronAPI.goForward();
    this.updateHistory();
    //this.electronAPI.onUrlchange()
  }

  refresh() {
    this.electronAPI.refresh();
    //this.electronAPI.onUrlchange()
  }

  goToPage(url: string) {
    this.electronAPI.goToPage(url)
      .then(() => this.updateHistory());
    //this.electronAPI.onUrlchange()
  }

  setToCurrentUrl() {
    this.electronAPI.currentUrl()
      .then((url :string) => {
        this.url = url;
      });
    //this.electronAPI.onUrlchange()
  }

  updateHistory() {
    this.setToCurrentUrl();

    this.electronAPI.canGoBack()
      .then((canGoBack : boolean) => this.canGoBack = canGoBack);

    this.electronAPI.canGoForward()
      .then((canGoForward : boolean) => this.canGoForward = canGoForward);
    
    //this.electronAPI.onUrlchange()
  }

}
