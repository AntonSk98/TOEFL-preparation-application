import { Injectable } from '@angular/core';
import {from} from 'rxjs';
import {ElectronService} from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  constructor(private electronService: ElectronService) { }
  getReadingTasks = () => {
    return from(new Promise(resolve => {
      this.electronService.ipcRenderer.send('get-reading');
      this.electronService.ipcRenderer.once('reading-sent', (event, result) => {
        resolve(result);
      });
    }));
  }

  getReadingPassageById = (id: number) => {
    return from(new Promise( resolve => {
      this.electronService.ipcRenderer.send('get-passage', id);
      this.electronService.ipcRenderer.once('passage-sent', (event, result) => {
        resolve(result[0].text);
      });
    }));
  }

  getReadingQuestionsByID(readingNumber: number) {
    return from (new Promise<object>(resolve => {
      this.electronService.ipcRenderer.send('get-questions', readingNumber);
      this.electronService.ipcRenderer.once('questions-sent', (event, result) => {
        resolve(result);
      });
    }));
  }
}
