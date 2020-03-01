import { Injectable } from '@angular/core';
import {from} from 'rxjs';
import {ElectronService} from 'ngx-electron';
import {Speaking} from "../models/speaking";

@Injectable({
  providedIn: 'root'
})
export class SpeakingService {

  constructor(private electronService: ElectronService) { }

  getSpeakingOneTasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-one');
      this.electronService.ipcRenderer.once('speaking-one-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getSpeakingTwoTasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-two');
      this.electronService.ipcRenderer.once('speaking-two-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getSpeakingThreeTasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-three');
      this.electronService.ipcRenderer.once('speaking-three-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getSpeakingFourTasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-four');
      this.electronService.ipcRenderer.once('speaking-four-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getSpeakingEx1Tasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-five');
      this.electronService.ipcRenderer.once('speaking-five-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getSpeakingEx2Tasks() {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-six');
      this.electronService.ipcRenderer.once('speaking-six-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getTextAndQuestionByTextTypeAndId(speakingTask: string, speakingNumber: number) {
    const speaking = new Speaking();
    if (speakingTask === speaking.speakingOne) { return this.getQuestionByTableNameAndId('speaking1', speakingNumber); }
    if (speakingTask === speaking.speakingTwo) { return this.getTextAndQuestionByTableNameAndId('speaking2', speakingNumber); }
    if (speakingTask === speaking.speakingThree) { return this.getTextAndQuestionByTableNameAndId('speaking3', speakingNumber); }
    if (speakingTask === speaking.speakingFour) { return this.getQuestionByTableNameAndId('speaking4', speakingNumber); }
    if (speakingTask === speaking.speakingExOne) { return this.getQuestionByTableNameAndId('exercise1', speakingNumber); }
    if (speakingTask === speaking.speakingExTwo) { return this.getQuestionByTableNameAndId('exercise2', speakingNumber); }
  }

  private getQuestionByTableNameAndId(tableName: string, id: number) {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-question', tableName, id);
      this.electronService.ipcRenderer.once('question-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  private getTextAndQuestionByTableNameAndId(tableName: string, id: number) {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-question-text', tableName, id);
      this.electronService.ipcRenderer.once('question-text-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  savePerformance(speakingTask: string, speakingNumber: number, score: number) {
    const speaking = new Speaking();
    let tableName;
    if (speakingTask === speaking.speakingOne) { tableName = 'speaking1'; }
    if (speakingTask === speaking.speakingTwo) { tableName = 'speaking2'; }
    if (speakingTask === speaking.speakingThree) { tableName = 'speaking3'; }
    if (speakingTask === speaking.speakingFour) { tableName = 'speaking4'; }
    if (speakingTask === speaking.speakingExOne) { tableName = 'exercise1'; }
    if (speakingTask === speaking.speakingExTwo) { tableName = 'exercise2'; }
    const scoreInPercent = Math.round((score / 4 * 100) * 100) / 100;
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('save-speaking', tableName, speakingNumber, scoreInPercent);
      this.electronService.ipcRenderer.once('speaking-saved', (event, result) => {
        resolve(result);
      });
    }));
  }

  getAverageScore() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-average-score');
      this.electronService.ipcRenderer.once('speaking-average-score-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getCompleteness() {
    return from (new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-speaking-completeness');
      this.electronService.ipcRenderer.once('speaking-completeness-sent', (event, result) => {
        resolve(result);
      });
    }));
  }
}
