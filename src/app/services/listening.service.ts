import { Injectable } from '@angular/core';
import {from} from "rxjs";
import {ElectronService} from "ngx-electron";

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
}
