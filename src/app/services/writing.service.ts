import { Injectable } from '@angular/core';
import {from} from 'rxjs';
import {ElectronService} from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class WritingService {

  constructor(
    private electronService: ElectronService,
  ) { }

  getIndependentWriting() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-independent-writing');
      this.electronService.ipcRenderer.once('independent-writing-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getIntegratedWriting() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-integrated-writing');
      this.electronService.ipcRenderer.once('integrated-writing-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getQuestionForIntegratedTask(writingNumber: number) {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-question-for-integrated-task', writingNumber);
      this.electronService.ipcRenderer.once('question-for-integrated-task-sent', (event, result) => {
        resolve(result.question);
      });
    }));
  }

  getPassageForIntegratedTask(writingNumber: number) {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-passage-for-integrated-task', writingNumber);
      this.electronService.ipcRenderer.once('passage-for-integrated-task-sent', (event, result) => {
        resolve(result.text);
      });
    }));
  }

  getIntegratedEssayByID(writingNumber: number) {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-integrated-essay', writingNumber);
      this.electronService.ipcRenderer.once('integrated-essay-sent', (event, result) => {
        resolve(result.essay);
      });
    }));
  }

  getIndependentEssayByID(writingNumber: number) {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-independent-essay', writingNumber);
      this.electronService.ipcRenderer.once('independent-essay-sent', (event, result) => {
        resolve(result.essay);
      });
    }));
  }

  updateIntegratedWritingScoreANDEssayByID(writingNumber: number, score: number, essay: string) {
    const scoreInPercent = Math.round((score / 5 * 100) * 100) / 100;
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('update-integrated-writing', writingNumber, scoreInPercent, essay);
      this.electronService.ipcRenderer.once('integrated-writing-updated', (event, result) => {
        resolve(result);
      });
    }));
  }

  updateIndependentWritingScoreANDEssayByID(writingNumber: number, score: number, essay: string) {
    const scoreInPercent = Math.round((score / 5 * 100) * 100) / 100;
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('update-independent-writing', writingNumber, scoreInPercent, essay);
      this.electronService.ipcRenderer.once('independent-writing-updated', (event, result) => {
        resolve(result);
      });
    }));
  }

  getCompleteness() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-writing-completeness');
      this.electronService.ipcRenderer.once('writing-completeness-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getAverageScore() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-writing-average-score');
      this.electronService.ipcRenderer.once('writing-average-score-sent', (event, result) => {
        resolve(result);
      });
    }));
  }
}
