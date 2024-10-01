const { app, WebContentsView, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs');


app.whenReady().then(() => {

  // BrowserWindow initiate the rendering of the angular toolbar
  const win = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  
  if (app.isPackaged){
      win.loadFile('dist/browser-template/browser/index.html');
    }else{
      win.loadURL('http://localhost:4200')
    }

  // WebContentsView initiate the rendering of a second view to browser the web
  const view = new WebContentsView();
  win.contentView.addChildView(view);

  // Always fit the web rendering with the electron windows
  function fitViewToWin() {
    const winSize = win.webContents.getOwnerBrowserWindow().getBounds();
    view.setBounds({ x: 0, y: 55, width: winSize.width, height: winSize.height });
  }

    win.webContents.openDevTools({ mode: 'detach' });


     // Écouter l'événement de navigation pour détecter une nouvelle URL
  view.webContents.on('did-start-navigation', (event, url) => {
    win.webContents.send('update-url', url); // Envoyer l'URL au Renderer Process (Angular)
  });
  
  // Register events handling from the toolbar
  ipcMain.on('toogle-dev-tool', () => {
    if (winContent.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  ipcMain.on('go-back', () => {
    view.webContents.navigationHistory.goBack();
  });

  ipcMain.handle('can-go-back', () => {
    return view.webContents.navigationHistory.canGoBack();
  });

  ipcMain.on('go-forward', () => {
    view.webContents.navigationHistory.goForward();
  });

  ipcMain.handle('can-go-forward', () => {
    return view.webContents.navigationHistory.canGoForward();
  });

  ipcMain.on('refresh', () => {
    view.webContents.reload();
  });

  ipcMain.handle('go-to-page', (event, url) => {
    return view.webContents.loadURL(url);
  });


  ipcMain.handle('current-url', () => {
    return view.webContents.getURL();
  });

  //Register events handling from the main windows
  win.once('ready-to-show', () => {
    fitViewToWin();
    view.webContents.loadURL('https://unimakers.fr');
  });

  win.on('resized', () => {
    fitViewToWin();
  });
  
  ipcMain.on('update-taskbar', (event, newUrl) => {
    win.setTitle(`Navigating: ${newUrl}`);  // Mettre à jour le titre de la fenêtre
  });

  ipcMain.handle('capture-screen', async () => {
    if (!win) {
      throw new Error('La fenêtre principale n\'est pas disponible');
    }

    const image = await view.webContents.capturePage(); // Capture l'écran actuel

    // Ouvrir une boîte de dialogue pour demander où sauvegarder la capture d'écran
    const { filePath } = await dialog.showSaveDialog(win, {
      title: 'Sauvegarder la capture d\'écran',
      defaultPath: path.join(app.getPath('pictures'), `screenshot-${new Date().toISOString().replace(/[-:.]/g, '')}.png`),
      filters: [
        { name: 'Images', extensions: ['png'] }
      ]
    });

    // Si l'utilisateur annule la sauvegarde, filePath sera undefined
    if (filePath) {
      // Sauvegarder l'image à l'emplacement choisi
      fs.writeFileSync(filePath, image.toPNG());
      return filePath; // Renvoie le chemin de l'image
    } else {
      return null; // Renvoie null si l'utilisateur a annulé
    }
  });
})
