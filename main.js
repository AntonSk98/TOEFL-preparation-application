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
    minWidth: 1366,
    minHeight: 768,
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
  mainWindow.setMenu(null);
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
    const result = connection('readingPractice').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('reading-sent', rows);
    })
      .catch(err => mainWindow.send("reading-sent", {
        status: 'error',
        message: 'Error occurred while getting reading tasks'
      }))
  });
  ipcMain.on('get-passage', async (event, id) => {
    const result = connection('readingPractice').select('text').where({id: id});
    await result.then( rows => {
      mainWindow.send('passage-sent', rows);
    })
      .catch(err => mainWindow.send("passage-sent", {
        status: 'error',
        message: 'Error occurred while getting the passage'
      }))
  });
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
  });

  ipcMain.on('update-score', async (event, id, score) => {
    const result = connection('readingPractice').where({id: id}).update({score: score});
    await result.then( () => {
      mainWindow.send('reading-sent', 'Score updated successfully');
    })
      .catch(err => mainWindow.send("score-updated", {
        status: 'error',
        message: 'Error occurred while getting reading tasks'
      }))
  });

  ipcMain.on('get-completeness', async () => {
    let completed = 0;
    let nonCompleted = 0;
    await connection.transaction(transaction => {
      connection('readingPractice').transacting(transaction).count().where('score', '>', -1)
        .then(completedCount => {
          completed = Object.values(completedCount[0])[0];
          return connection('readingPractice').transacting(transaction).count('score')
        })
        .then(nonCompletedCount => {
          nonCompleted = Object.values(nonCompletedCount[0])[0];
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then(() => mainWindow.send('completeness-sent', Math.round((completed/nonCompleted * 100) * 10) / 10))
      .catch(err => mainWindow.send('completeness-sent', 'Error occurred while getting completeness info'))
  });

  ipcMain.on('get-target-score', async () => {
    const result = connection('targetTable').select('targetReading').first();
    await result.then( (targetScore) => {
      mainWindow.send('target-score-sent', targetScore.targetReading);
    })
      .catch(err => mainWindow.send("target-score-sent", {
        status: 'error',
        message: 'Error occurred while getting targetScore'
      }))
  });

  ipcMain.on('get-average-score', async () => {
    let averageScore = 0;
    let numberOfRows = 0;
    await connection.transaction(transaction => {
      connection('readingPractice').transacting(transaction).count().where('score', '>', -1)
        .then(allCount => {
          numberOfRows = Object.values(allCount[0])[0];
          return connection('readingPractice').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(completedPassages => {
          averageScore = Object.values(completedPassages).reduce((sum,value) => sum + value.score, 0) / numberOfRows;
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then(() => mainWindow.send('average-score-sent', Math.round((averageScore/100*30))))
      .catch(err => mainWindow.send('average-score-sent', 'Error occurred while getting average score'))
  })
}
ListeningPart: {
  ipcMain.on('get-listening', async () => {
    const result = connection('listeningPractice').select('id').select('title').select('score').select('type');
    await result.then( rows => {
      mainWindow.send('listening-sent', rows);
    })
      .catch(err => mainWindow.send("listening-sent", {
        status: 'error',
        message: 'Error occurred while getting listening tasks'
      }))
  });
  ipcMain.on('get-listening-entity', async (event, listeningNumber) => {
    let response = {};
    connection.transaction(transaction => {
      connection('listeningQuestions').transacting(transaction).select('id', 'question', 'audioPath').where({listeningNumber: listeningNumber})
        .then(listeningQuestions => {
          response.listeningQuestions = listeningQuestions;
          return connection('answerChoiceListening').transacting(transaction).select('id', 'answerChoice', 'questionNumID').where({listeningNumber: listeningNumber})
        })
        .then(answerChoiceListening => {
          response.answerChoiceListening = answerChoiceListening;
          return connection('correctAnswersListening').transacting(transaction).select('questionID', 'answerID', 'explanation').where({listeningNumber: listeningNumber})
        })
        .then(correctAnswersListening => {
          response.correctAnswersListening = correctAnswersListening;
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then( () => {
        mainWindow.send("listening-entity-sent", response);
      })
      .catch(err => mainWindow.send("listening-entity-sent", {
        status: 'error',
        message: 'Error occurred while getting the questions of current listening test'
      }))
  });
  ipcMain.on('update-listening-score', async (event, id, score) => {
    const result = connection('listeningPractice').where({id: id}).update({score: score});
    await result.then( () => {
      mainWindow.send('listening-score-updated', 'Score updated successfully');
    })
      .catch(err => mainWindow.send("listening-score-updated", {
        status: 'error',
        message: 'Error occurred while updating listening score'
      }))
  });

  ipcMain.on('get-listening-completeness', async () => {
    let completed = 0;
    let nonCompleted = 0;
    await connection.transaction(transaction => {
      connection('listeningPractice').transacting(transaction).count().where('score', '>', -1)
        .then(completedCount => {
          completed = Object.values(completedCount[0])[0];
          return connection('listeningPractice').transacting(transaction).count('score')
        })
        .then(nonCompletedCount => {
          nonCompleted = Object.values(nonCompletedCount[0])[0];
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then(() => mainWindow.send('listening-completeness-sent', Math.round((completed/nonCompleted * 100) * 10) / 10))
      .catch(err => mainWindow.send('listening-completeness-sent', 'Error occurred while getting completeness info'))
  });

  ipcMain.on('get-listening-average-score', async () => {
    let averageScore = 0;
    let numberOfRows = 0;
    await connection.transaction(transaction => {
      connection('listeningPractice').transacting(transaction).count().where('score', '>', -1)
        .then(allCount => {
          numberOfRows = Object.values(allCount[0])[0];
          return connection('listeningPractice').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(completedTasks => {
          averageScore = Object.values(completedTasks).reduce((sum,value) => sum + value.score, 0) / numberOfRows;
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then(() => mainWindow.send('listening-average-score-sent', Math.round((averageScore/100*30))))
      .catch(err => mainWindow.send('listening-average-score-sent', 'Error occurred while getting average score'))
  })
}
SpeakingPart: {
  ipcMain.on('get-speaking-one', async () => {
    const result = connection('speaking1').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('speaking-one-sent', rows);
    })
      .catch(err => mainWindow.send("speaking-one-sent", {
        status: 'error',
        message: 'Error occurred while getting speaking tasks'
      }))
  });
  ipcMain.on('get-speaking-two', async () => {
    const result = connection('speaking2').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('speaking-two-sent', rows);
    })
      .catch(err => mainWindow.send("speaking-two-sent", {
        status: 'error',
        message: 'Error occurred while getting speaking tasks'
      }))
  });
  ipcMain.on('get-speaking-three', async () => {
    const result = connection('speaking3').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('speaking-three-sent', rows);
    })
      .catch(err => mainWindow.send("speaking-three-sent", {
        status: 'error',
        message: 'Error occurred while getting speaking tasks'
      }))
  });
  ipcMain.on('get-speaking-four', async () => {
    const result = connection('speaking4').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('speaking-four-sent', rows);
    })
      .catch(err => mainWindow.send("speaking-four-sent", {
        status: 'error',
        message: 'Error occurred while getting speaking tasks'
      }))
  });
  ipcMain.on('get-speaking-five', async () => {
    const result = connection('exercise1').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('speaking-five-sent', rows);
    })
      .catch(err => mainWindow.send("speaking-five-sent", {
        status: 'error',
        message: 'Error occurred while getting speaking tasks'
      }))
  });
  ipcMain.on('get-speaking-six', async () => {
    const result = connection('exercise2').select('id').select('title').select('score');
    await result.then( rows => {
      mainWindow.send('speaking-six-sent', rows);
    })
      .catch(err => mainWindow.send("speaking-six-sent", {
        status: 'error',
        message: 'Error occurred while getting speaking tasks'
      }))
  });
  ipcMain.on('get-question-text', async (event, tableName, id) => {
    const result = connection(tableName).select('question').select('text').where({id: id}).first();
    await result.then( rows => {
      mainWindow.send('question-text-sent', rows)
    })
      .catch(() => mainWindow.send('question-text-sent', 'Error occurred while getting question and text'))
  });
  ipcMain.on('get-question', async (event, tableName, id) => {
    const result = connection(tableName).select('question').where({id: id}).first();
    await result.then( rows => {
      mainWindow.send('question-sent', rows)
    })
      .catch(() => mainWindow.send('question-sent', 'Error occurred while getting question and text'))
  });
  ipcMain.on('save-speaking', async (event, tableName, id, score) => {
    const result = connection(tableName).where({id: id}).update({score: score});
    await result.then( () => {
      mainWindow.send('speaking-saved',
        {
          status: 'success',
          message: 'Response is submitted!'
        })
    })
      .catch(() => mainWindow.send('speaking-saved', {
        status: 'error',
        message: 'Error occurred while saving speaking score'
      }))
  })
  ipcMain.on('get-speaking-average-score', async () => {
    let sumScore = 0;
    let numberOfRows = 0;
    await connection.transaction(transaction => {
      connection('speaking1').transacting(transaction).select('score').where('score', '>', -1)
        .then(speaking1 => {
          numberOfRows += speaking1.length;
          sumScore += Object.values(speaking1).reduce((sum,value) => sum + value.score, 0);
          return connection('speaking2').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(speaking2 => {
          numberOfRows += speaking2.length;
          sumScore += Object.values(speaking2).reduce((sum,value) => sum + value.score, 0);
          return connection('speaking3').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(speaking3 => {
          numberOfRows += speaking3.length;
          sumScore += Object.values(speaking3).reduce((sum,value) => sum + value.score, 0);
          return connection('speaking4').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(speaking4 => {
          numberOfRows += speaking4.length;
          sumScore += Object.values(speaking4).reduce((sum,value) => sum + value.score, 0);
          return connection('exercise1').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(exercise1 => {
          numberOfRows += exercise1.length;
          sumScore += Object.values(exercise1).reduce((sum,value) => sum + value.score, 0);
          return connection('exercise2').transacting(transaction).select('score').where('score', '>', -1)
        })
        .then(exercise2 => {
          numberOfRows += exercise2.length;
          sumScore += Object.values(exercise2).reduce((sum,value) => sum + value.score, 0);
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then(() => mainWindow.send('speaking-average-score-sent', Math.round((sumScore/numberOfRows/100*30))))
      .catch(err => mainWindow.send('speaking-average-score-sent', 'Error occurred while getting average score'))
  });
  ipcMain.on('get-speaking-completeness', async () => {
    let completed = 0;
    let allRows = 0;
    await connection.transaction(transaction => {
      connection('speaking1').transacting(transaction).count().where('score', '>', -1)
        .then(speaking1Completed => {
          completed += Object.values(speaking1Completed[0])[0];
          return connection('speaking1').transacting(transaction).count('score')
        })
        .then(speaking1All => {
          allRows += Object.values(speaking1All[0])[0];
          return connection('speaking2').transacting(transaction).count().where('score', '>', -1)
        })
        .then(speaking2Completed => {
          completed += Object.values(speaking2Completed[0])[0];
          return connection('speaking2').transacting(transaction).count('score')
        })
        .then(speaking2All => {
          allRows += Object.values(speaking2All[0])[0];
          return connection('speaking3').transacting(transaction).count().where('score', '>', -1)
        })
        .then(speaking3Completed => {
          completed += Object.values(speaking3Completed[0])[0];
          return connection('speaking3').transacting(transaction).count('score')
        })
        .then(speaking3All => {
          allRows += Object.values(speaking3All[0])[0];
          return connection('speaking4').transacting(transaction).count().where('score', '>', -1)
        })
        .then(speaking4Completed => {
          completed += Object.values(speaking4Completed[0])[0];
          return connection('speaking4').transacting(transaction).count('score')
        })
        .then(speaking4All => {
          allRows += Object.values(speaking4All[0])[0];
          return connection('exercise1').transacting(transaction).count().where('score', '>', -1)
        })
        .then(exercise1Completed => {
          completed += Object.values(exercise1Completed[0])[0];
          return connection('exercise1').transacting(transaction).count('score')
        })
        .then(exercise1All => {
          allRows += Object.values(exercise1All[0])[0];
          return connection('exercise2').transacting(transaction).count().where('score', '>', -1)
        })
        .then(exercise2Completed => {
          completed += Object.values(exercise2Completed[0])[0];
          return connection('exercise2').transacting(transaction).count('score')
        })
        .then(exercise2All => {
          allRows += Object.values(exercise2All[0])[0];
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
      .then(() => mainWindow.send('speaking-completeness-sent', Math.round((completed/allRows * 100) * 10) / 10))
      .catch(err => mainWindow.send('speaking-completeness-sent', 'Error occurred while getting completeness info'))
  });
}

// npm run start:electron
