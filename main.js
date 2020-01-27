const targetScorePart = require("./src/app/server/targetScorePart.js");
const {app, BrowserWindow, ipcMain} = require('electron');
const url = require("url");
const path = require("path");

let mainWindow;

const connection = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./src/db/toefl.db"
  },
  useNullAsDefault: true
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});

TargetScore: {
  ipcMain.on('get-target', async () => {
    const result = connection.select().table("targetTable");
    await result.then(rows => {
      mainWindow.send("targetSent", rows);
    })
      .catch(err => mainWindow.send("targetSend", err))
  });

  ipcMain.on('update-date', async (event, date) => {
    const result = connection('targetTable').update(date);
    await result
      .then(() => {
        mainWindow.send("updated-date", {
          status: 'success',
          message: 'Test date saved'
        });
      })
      .catch(() => mainWindow.send("updated-date", {
        status: 'error',
        message: 'Error occurred while updating the date'
      }))
  });

  ipcMain.on('update-score', async (event, score) => {
    const result = connection('targetTable').update(score);
    await result
      .then(() => {
        mainWindow.send("updated-score", {
          status: 'success',
          message: 'Target score saved'
        });
      })
      .catch(err => mainWindow.send("updated-score", {
        status: 'error',
        message: 'Error occurred while updating the target score'
      }))
  });
}


// npm run start:electron
