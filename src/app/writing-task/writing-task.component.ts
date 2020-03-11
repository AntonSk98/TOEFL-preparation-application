import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {faWindowClose, faPlay, faTable} from '@fortawesome/free-solid-svg-icons';
import {WritingService} from '../services/writing.service';
import {Subscription} from 'rxjs';
import {Writing} from '../models/writing';
import {CdTimerComponent} from 'angular-cd-timer';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NotificationService} from '../services/notification.service';

@Component({
  selector: 'app-writing-task',
  templateUrl: './writing-task.component.html',
  styleUrls: ['./writing-task.component.css'],
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
export class WritingTaskComponent implements OnInit, OnDestroy {

  @ViewChild('timer', {
    static: false
  }) timer: CdTimerComponent;

  subscriptions = new Subscription();
  writing = new Writing();
  writingNumber: number;
  wordCount = 0;
  writingType: string;
  writingTitle: string;
  showTable = false;
  essay: string;
  score: number;
  faBackward = faWindowClose;
  faPlay = faPlay;
  faTable = faTable;
  integratedTask = {
    question: '',
    passage: ''
  };
  passageTimer = {
    isTimerPaused: true,
    toResetTimer: true
  };
  constructor(
    private route: ActivatedRoute,
    private writingService: WritingService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.writingNumber = this.route.snapshot.params.id;
    this.writingType = this.route.snapshot.params.type;
    this.writingTitle = this.route.snapshot.params.title;
    this.getWritingTasks(this.writingType);
  }

  completeReadingTimer() {
    this.passageTimer.isTimerPaused = true;
    this.timer.reset();
  }

  changeStateOfTimer() {
    this.passageTimer.isTimerPaused = !this.passageTimer.isTimerPaused;
    this.passageTimer.isTimerPaused ? this.timer.stop() : this.timer.resume();
  }

  resetTimer() {
    if (this.passageTimer.toResetTimer) {
      this.timer.reset();
      this.timer.stop();
      this.passageTimer.toResetTimer = false;
    }
  }
  getWritingTasks(writingType: string) {
    if ( writingType === this.writing.integratedWriting ) {
      this.subscriptions.add(this.writingService.getIntegratedEssayByID(this.writingNumber).subscribe((essay: string) => {
        this.essay = essay;
        this.countWords();
      }));
      this.subscriptions.add(this.writingService.getQuestionForIntegratedTask(this.writingNumber).subscribe((question: string) => {
        this.integratedTask.question = question;
      }));
      this.subscriptions.add(this.writingService.getPassageForIntegratedTask(this.writingNumber).subscribe((passage: string) => {
        this.integratedTask.passage = passage;
      }));
    } else {
      this.subscriptions.add(this.writingService.getIndependentEssayByID(this.writingNumber).subscribe((essay: string) => {
        this.essay = essay;
        this.countWords();
      }));
    }
  }

  submitPerformance() {
    if (!this.score) { this.score = 0; }
    if (this.writingType === this.writing.integratedWriting) {
      this.subscriptions
        .add(this.writingService.updateIntegratedWritingScoreANDEssayByID(this.writingNumber, this.score, this.essay)
          .subscribe((message: any) => {
          this.notificationService.showMessage(message);
          setTimeout(() => this.router.navigateByUrl('/').then(() => {} ), 5000);
        }));
    } else {
      this.subscriptions
        .add(this.writingService.updateIndependentWritingScoreANDEssayByID(this.writingNumber, this.score, this.essay)
          .subscribe((message: any) => {
          this.notificationService.showMessage(message);
          setTimeout(() => this.router.navigateByUrl('/').then(() => {} ), 5000);
        }));
    }
  }

  manipulateTable() {
    this.showTable = !this.showTable;
  }

  checkScore() {
    if ( this.score > 5 ) { this.score = 5.0; }
    if ( this.score < 0 ) { this.score = 0.0; }
  }

  countWords() {
    this.wordCount = this.essay.trim().split(/\s+/).length;
    if (!this.essay) { this.wordCount = 0; }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
