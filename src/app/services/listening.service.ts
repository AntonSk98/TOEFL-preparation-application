import { Injectable } from '@angular/core';
import {from} from 'rxjs';
import {ElectronService} from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class ListeningService {

  constructor(private electronService: ElectronService) { }

  getListeningTasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-listening');
      this.electronService.ipcRenderer.once('listening-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getListeningEntityByID(listeningNumber: number) {
    return from (new Promise<object>(resolve => {
      this.electronService.ipcRenderer.send('get-listening-entity', listeningNumber);
      this.electronService.ipcRenderer.once('listening-entity-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  updateListeningScoreByID(listeningNumber: number, listeningScoreInPercent: number) {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('update-listening-score', listeningNumber, listeningScoreInPercent);
      this.electronService.ipcRenderer.once('listening-score-updated', (event, result) => {
        resolve(result);
      });
    }));
  }

  getCompleteness() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-listening-completeness');
      this.electronService.ipcRenderer.once('listening-completeness-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getAverageScore() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-listening-average-score');
      this.electronService.ipcRenderer.once('listening-average-score-sent', (event, result) => {
        resolve(result);
      });
    }));
  }
}
