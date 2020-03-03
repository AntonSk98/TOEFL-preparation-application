import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {faCalendar, faEdit, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TargetService} from '../services/target.service';
import {TargetSettings} from '../models/targetSettings';
import {AverageProgress} from '../models/averageProgress';
import {NotificationService} from '../services/notification.service';
import {ReadingService} from '../services/reading.service';
import {ListeningService} from '../services/listening.service';
import {SpeakingService} from '../services/speaking.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  @Output() emitTargetScore = new EventEmitter();
  targetScore = 'The target scores must range from 0 to 30';
  averageScore = 'The score averages are out of 30';
  isEdited = false;
  sumTarget: number;
  faCalendar = faCalendar;
  faEdit = faEdit;
  faQuestion = faQuestionCircle;
  targetSettings: TargetSettings = new TargetSettings();
  averageProgress: AverageProgress = new AverageProgress();
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
  testDate: NgbDateStruct;
  dayRemained: number;
  subscriptions = new Subscription();

  constructor(
    private targetService: TargetService, private ref: ChangeDetectorRef,
    private parserFormatter: NgbDateParserFormatter,
    private notificationService: NotificationService,
    private readingService: ReadingService,
    private listeningService: ListeningService,
    private speakingService: SpeakingService
  ) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this.targetService.getTargetScore().subscribe((value: TargetSettings) => {
        this.targetSettings = value;
        this.testDate = this.convertDateToNGBDATE(this.targetSettings.toeflDate);
        this.dayRemained = this.calculateRemainedDays(this.today, this.testDate);
        this.countSumTargetScore();
      })
    );
    this.subscriptions
      .add(this.readingService.getAverageScore().subscribe( (value: number) => this.averageProgress.averageReading = value));
    this.subscriptions
      .add(this.listeningService.getAverageScore().subscribe((value: number) => this.averageProgress.averageListening = value));
    this.subscriptions
      .add(this.speakingService.getAverageScore().subscribe((value: number) => this.averageProgress.averageSpeaking = value));
  }
  convertDateToNGBDATE(testDate: string): NgbDateStruct {
    const date = new Date(testDate);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }
  calculateRemainedDays(today: NgbDateStruct, testDate: NgbDateStruct): number {
    const test = new Date(testDate.year, testDate.month - 1, testDate.day);
    const now = new Date(today.year, today.month - 1, today.day);
    return Math.round((test.getTime() - now.getTime()) / 1000 / 60 / 60 / 24);
  }

  onDateSelected(): void {
    this.dayRemained = this.calculateRemainedDays(this.today, this.testDate);
    this.subscriptions.add(this.targetService.updateToeflDate(this.parserFormatter.format(this.testDate)).subscribe(value => {
      this.notificationService.showMessage(value);
    }));
  }
  countSumTargetScore(): void {
    this.sumTarget = Number(this.targetSettings.targetReading) +
      Number(this.targetSettings.targetListening) +
      Number(this.targetSettings.targetSpeaking) +
      Number(this.targetSettings.targetWriting);
  }
  toSave() {
    this.changeEdited();
    if (this.targetSettings.targetReading == null) {
      this.targetSettings.targetReading = 0;
    }
    if (this.targetSettings.targetListening == null) {
      this.targetSettings.targetListening = 0;
    }
    if (this.targetSettings.targetWriting == null) {
      this.targetSettings.targetWriting = 0;
    }
    if (this.targetSettings.targetSpeaking == null) {
      this.targetSettings.targetSpeaking = 0;
    }
    this.countSumTargetScore();
    this.subscriptions.add(this.targetService.updateToeflScore(this.targetSettings).subscribe(value => {
      this.notificationService.showMessage(value);
    }));
    this.emitTargetScore.emit(this.targetSettings);
  }

  changeEdited() {
    this.isEdited = !this.isEdited;
  }

  checkValue(value: number): number {
    if (value < 0) {
      return value = 0;
    } else if (value > 30) {
      return value = 30;
    }
    return value;
  }

  checkReading() {
    this.targetSettings.targetReading = this.checkValue(this.targetSettings.targetReading);
  }

  checkListening() {
    this.targetSettings.targetListening = this.checkValue(this.targetSettings.targetListening);
  }

  checkSpeaking() {
    this.targetSettings.targetSpeaking = this.checkValue(this.targetSettings.targetSpeaking);
  }

  checkWriting() {
    this.targetSettings.targetWriting = this.checkValue(this.targetSettings.targetWriting);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}


