// const {ipcMain} = require('electron');
//
// getTargetScore = (mainWindow, connection) => {
//   ipcMain.on('get-target', async () => {
//     try {
//       const result = connection.select().table("targetTable");
//       await result.then(rows => {
//         mainWindow.send("targetSent", rows);
//       })
//     } catch (err) {
//       throw err;
//     }
//   });
// };
//
// updateTargetScore = (mainWindow, connection) => {
//   ipcMain.on('update-score', async (date) => {
//     try {
//       const result = connection('targetTable').update({ toeflDate: date});
//       await result.then(rows => {
//         mainWindow.send("scoreUpdated", rows);
//       })
//     } catch (err) {
//       throw err;
//     }
//   })
// };
//
// module.exports = function (mainWindow, connection) {
//   getTargetScore(mainWindow, connection);
// };
