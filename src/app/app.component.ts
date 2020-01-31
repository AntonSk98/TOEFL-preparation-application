import {Component, OnChanges} from '@angular/core';
import {Router, RouterEvent} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-toefl';
  constructor(private router: Router) {
  }
}
