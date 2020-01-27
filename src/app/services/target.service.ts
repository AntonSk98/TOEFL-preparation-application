import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {from} from 'rxjs';
import {TargetSettings} from '../models/targetSettings';

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  constructor(private electronService: ElectronService) {
  }

  getTargetScore = () => {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-target');
      this.electronService.ipcRenderer.on('targetSent', (event, result) => {
        resolve(result[0]);
      });
    }));
  }
  updateToeflDate = (toeflDate: string) => {
    return from(new Promise(resolve => {
        this.electronService.ipcRenderer.send('update-date', {toeflDate});
        this.electronService.ipcRenderer.once('updated-date', (event, result) => {
          resolve(result);
        });
      }));
  }
  updateToeflScore = (toeflScore: TargetSettings) => {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('update-score', {
        targetReading: toeflScore.targetReading,
        targetListening: toeflScore.targetListening,
        targetSpeaking: toeflScore.targetSpeaking,
        targetWriting: toeflScore.targetWriting
      });
      this.electronService.ipcRenderer.once('updated-score', (event, result) => {
        resolve(result);
      });
    }));
  }
}
