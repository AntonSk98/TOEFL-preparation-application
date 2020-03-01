import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }
  showMessage(message: any) {
    message.status === 'success' ? this.toastr.success(message.message) : this.toastr.error(message.message);
  }
  showWarning(message: any) {
    this.toastr.warning(message);
  }
}
