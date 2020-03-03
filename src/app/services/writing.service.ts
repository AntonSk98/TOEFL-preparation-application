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
}
