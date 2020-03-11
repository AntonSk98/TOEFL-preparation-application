import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Speaking} from '../models/speaking';
import {faPlay, faTable, faWindowClose} from '@fortawesome/free-solid-svg-icons';
import {CdTimerComponent} from 'angular-cd-timer';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SpeakingService} from '../services/speaking.service';
import {NotificationService} from '../services/notification.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-speaking-task',
  templateUrl: './speaking-task.component.html',
  styleUrls: ['./speaking-task.component.css'],
  animations: [
    trigger('toggleTable', [
      // ...
      state('open', style({
        opacity: 1,
        display: 'block'
      })),
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      transition('open => closed', [
        animate('0.5s')
      ])
    ]),
  ]
})
export class SpeakingTaskComponent implements OnInit, OnDestroy {

  @ViewChild('timer', {
    static: false
  }) timer: CdTimerComponent;
  @ViewChild('timerPreparation', {
    static: false
  }) timerPreparation: CdTimerComponent;
  @ViewChild('timerPerformance', {
    static: false
  }) timerPerformance: CdTimerComponent;
  isTimerPaused = true;
  toResetTimer = true;
  answerPreparationPaused = true;
  resetAnswerPreparation = true;
  faTable = faTable;
  faPlay = faPlay;
  faBackward = faWindowClose;
  speakingNumber: number;
  speakingTask: string;
  showTable = false;
  speaking: Speaking = new Speaking();
  subscriptions = new Subscription();
  textToRead: string;
  question: string;
  score: number;
  answerPerformancePaused = true;
  resetPerformance = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private speakingService: SpeakingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.speakingNumber = this.route.snapshot.params.id;
    this.speakingTask = this.route.snapshot.params.type;
    this.subscriptions.add(
      this.speakingService.getTextAndQuestionByTextTypeAndId(this.speakingTask, this.speakingNumber).subscribe((object: any) => {
        this.textToRead = object.text;
        this.question = object.question;
      })
    );
  }

  completeReadingTimer() {
    this.isTimerPaused = true;
    this.timer.reset();
  }

  changeStateOfTimer() {
    this.isTimerPaused = !this.isTimerPaused;
    this.isTimerPaused ? this.timer.stop() : this.timer.resume();
  }

  resetTimer() {
    if (this.toResetTimer) {
      this.timer.reset();
      this.timer.stop();
      this.toResetTimer = false;
    }
  }

  changeStateOfTimerPreparation() {
    this.answerPreparationPaused = !this.answerPreparationPaused;
    this.answerPreparationPaused ? this.timerPreparation.stop() : this.timerPreparation.resume();
  }
  resetPreparingTimer() {
    if (this.resetAnswerPreparation) {
      this.timerPreparation.reset();
      this.timerPreparation.stop();
      this.resetAnswerPreparation = false;
    }
  }

  getTimeForPreparation(): number {
    if ( this.speakingTask === this.speaking.speakingOne || this.speakingTask === this.speaking.speakingExOne ) { return 15; }
    if ( this.speakingTask === this.speaking.speakingTwo || this.speakingTask === this.speaking.speakingThree ) { return 45; }
    if ( this.speakingTask === this.speaking.speakingFour || this.speakingTask === this.speaking.speakingExTwo ) { return 20; }
  }

  getTimeForResponse(): number {
    if ( this.speakingTask === this.speaking.speakingOne || this.speakingTask === this.speaking.speakingExOne ) { return 45; }
    if ( this.speakingTask === this.speaking.speakingTwo || this.speakingTask === this.speaking.speakingThree ) { return 60; }
    if ( this.speakingTask === this.speaking.speakingFour || this.speakingTask === this.speaking.speakingExTwo ) { return 60; }
  }

  checkScore() {
    if ( this.score > 4 ) { this.score = 4.0; }
    if ( this.score < 0 ) { this.score = 0.0; }
  }

  submitPerformance() {
    if (!this.score) { this.score = 0; }
    this.subscriptions.add(
      this.speakingService.savePerformance(this.speakingTask, this.speakingNumber, this.score).subscribe( (message: string) => {
        this.notificationService.showMessage(message);
        setTimeout(() => this.router.navigateByUrl('/').then(() => {} ), 5000);
      })
    );
  }

  manipulateTable() {
    this.showTable = !this.showTable;
  }

  changeStateOfTimerPerformance() {
    this.answerPerformancePaused = !this.answerPerformancePaused;
    this.answerPerformancePaused ? this.timerPerformance.stop() : this.timerPerformance.resume();
  }

  resetPerformanceTimer() {
    if (this.resetPerformance) {
      this.timerPerformance.reset();
      this.timerPerformance.stop();
      this.resetPerformance = false;
    }
  }

  completeResponseTimer() {
    this.answerPerformancePaused = true;
    this.timerPerformance.reset();
  }

  completePreparationTimer() {
    this.answerPreparationPaused = true;
    this.timerPreparation.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
