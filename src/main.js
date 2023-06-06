const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  // Crea la ventana del navegador.
  win = new BrowserWindow({ width: 800, height: 600 });

  // Carga la aplicación de Ionic.
  win.loadURL('http://localhost:8134/');

  // Abre las herramientas de desarrollo de Chrome.
  win.webContents.openDevTools();

  // Maneja el evento de cierre de la ventana.
  win.on('closed', () => {
    win = null;
  });
}

// Este método se llama cuando la aplicación está lista para iniciarse.
// Algunas APIs solo se pueden usar después de que se produzca este evento.
app.on('ready', createWindow);

// Sal cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
  // En macOS, es común para las aplicaciones y su barra de menú
  // permanecer activas hasta que el usuario salga explícitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS, es común volver a crear una ventana en la aplicación cuando el
  // icono del dock se hace clic y no hay otras ventanas abiertas.
  if (win === null) {
    createWindow();
  }
});