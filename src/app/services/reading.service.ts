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
}
