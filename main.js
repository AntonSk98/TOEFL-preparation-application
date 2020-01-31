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

  function loadUrl() {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
  }
  // mainWindow.setMenu(null);
  loadUrl();

  mainWindow.webContents.on('did-fail-load', () => {
    console.log('failed...')
    loadUrl();
  });
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('loading...')
  });
  mainWindow.webContents.on('did-stop-loading', () => {
    console.log('stop loading...')
  });

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

ReadingPart: {
  ipcMain.on('get-reading', async () => {
    const result = connection('readingPractice').select('id').select('readingTitle').select('score');
    await result.then( rows => {
      mainWindow.send('reading-sent', rows);
    })
      .catch(err => mainWindow.send("reading-sent", {
        status: 'error',
        message: 'Error occurred while getting reading tasks'
      }))
  })
  ipcMain.on('get-passage', async (event, id) => {
    const result = connection('readingPractice').select('text').where({id: id});
    await result.then( rows => {
      mainWindow.send('passage-sent', rows);
    })
      .catch(err => mainWindow.send("passage-sent", {
        status: 'error',
        message: 'Error occurred while getting the passage'
      }))
  })
  ipcMain.on('get-questions', async (event, id) => {
    let response = {};
    connection.transaction(transaction => {
      connection('readingQuestions').transacting(transaction).select('id', 'question').where({readingNumber: id})
        .then(questions => {
          response.questions = questions;
          return connection('answerChoiceReading').transacting(transaction).whereBetween('questionNumID', [id*10-9, id*10])
        })
        .then(answerChoices => {
          response.answerChoices = answerChoices;
          return connection('correctAnswersReading').transacting(transaction).whereBetween('questionID', [id*10-9, id*10])
        })
        .then(correctAnswers => {
          response.correctAnswers = correctAnswers;
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then( () => {
        mainWindow.send("questions-sent", response);
      })
      .catch(err => mainWindow.send("passage-sent", {
        status: 'error',
        message: 'Error occurred while getting the questions of the passage'
      }))
  })
}
ListeningPart: {

}


// npm run start:electron
