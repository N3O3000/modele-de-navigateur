const { app, WebContentsView, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs');
const { visitLexicalEnvironment } = require('typescript');



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

  ipcMain.handle('capture-webview', async () => {
    if (!view) {
      throw new Error('La webview n\'est pas disponible');
    }

    // Injection du script de capture dans la webview
    const result = await view.webContents.executeJavaScript(`
       (async function() {
        const canvas = document.createElement('canvas');
        const width = document.documentElement.scrollWidth;
        const height = document.documentElement.scrollHeight;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        // Fonction pour capturer les ressources externes comme les URL, les images et les icônes
        function captureResources(element) {
          const computedStyle = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          
          // Capturer les images de fond (background-image)
          const backgroundImage = computedStyle.backgroundImage;
          if (backgroundImage && backgroundImage !== 'none') {
            const imageUrl = backgroundImage.slice(5, -2);
            const img = new Image();
            img.src = imageUrl;
            context.drawImage(img, rect.left, rect.top, rect.width, rect.height);
          }

          // Capturer les images <img>
          if (element.tagName === 'IMG' && element.src) {
            const img = new Image();
            img.src = element.src;
            context.drawImage(img, rect.left, rect.top, rect.width, rect.height);
          }

          // Capturer les icônes <link rel="icon">
          if (element.tagName === 'LINK' && element.rel === 'icon' && element.href) {
            const icon = new Image();
            icon.src = element.href;
            context.drawImage(icon, rect.left, rect.top, 32, 32); // Dessiner l'icône à une taille arbitraire
          }

          // Capturer les liens URL
          if (element.tagName === 'A' && element.href) {
            context.fillStyle = 'blue'; // Affiche les liens en bleu
            context.fillText(element.href, rect.left, rect.top + 16);
          }
        }

        // Fonction pour capturer le DOM, le CSS et les ressources externes
        function drawElement(element) {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);

          // Appliquer le modèle de boîte
          const paddingTop = parseFloat(style.paddingTop);
          const paddingLeft = parseFloat(style.paddingLeft);
          const borderWidth = parseFloat(style.borderWidth) || 0;

          // Dessiner l'arrière-plan
          if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            context.fillStyle = style.backgroundColor;
            context.fillRect(rect.left, rect.top, rect.width, rect.height);
          }

          // Appliquer les bordures
          if (borderWidth > 0) {
            context.strokeStyle = style.borderColor;
            context.lineWidth = borderWidth;
            context.strokeRect(rect.left, rect.top, rect.width, rect.height);
          }

          // Dessiner le texte avec les polices et styles
          if (element.innerText) {
            context.fillStyle = style.color || '#000';
            context.font = \`\${style.fontWeight} \${style.fontSize} \${style.fontFamily}\`;
            context.fillText(
              element.innerText,
              rect.left + paddingLeft,
              rect.top + paddingTop + parseFloat(style.fontSize)
            );
          }

          // Appeler la fonction pour capturer les ressources
          captureResources(element);
        }

        // Parcourir et dessiner chaque élément du DOM
        function drawDOM(element) {
          drawElement(element);

          for (let i = 0; i < element.children.length; i++) {
            drawDOM(element.children[i]);
          }
        }

        drawDOM(document.body); // Démarrer à partir du body

        // Retourner l'image finale sous forme de base64
        return canvas.toDataURL('image/png');
      })();
    `);

    return result; // Retourne l'image capturée en base64
  });
});