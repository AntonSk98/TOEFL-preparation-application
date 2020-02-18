import { Injectable } from '@angular/core';
import {from} from 'rxjs';
import {ElectronService} from 'ngx-electron';

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
}
