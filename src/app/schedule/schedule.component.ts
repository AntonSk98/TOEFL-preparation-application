import {Component, OnInit} from '@angular/core';
import {faCalendar, faEdit, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {NgbCalendar, NgbDateStruct, NgbInputDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {Progress} from './progress';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  targetScore = 'The target scores must range from 0 to 30';
  averageScore = 'The score averages are out of 30';
  isEdited = false;
  faCalendar = faCalendar;
  faEdit = faEdit;
  faQuestion = faQuestionCircle;
  progress: Progress = new Progress();
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
  testDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 2};
  dayRemained = this.calculateRemainedDays(this.today, this.testDate);
  sumTarget = this.progress.targetReading + this.progress.targetListening + this.progress.targetSpeaking + this.progress.targetWriting;
  constructor(config: NgbInputDatepickerConfig, calendar: NgbCalendar) {
  }
  ngOnInit() {
  }
  calculateRemainedDays(today: NgbDateStruct, testDate: NgbDateStruct): number {
    const test = new Date(testDate.year, testDate.month - 1, testDate.day);
    const now = new Date(today.year, today.month - 1, today.day);
    return (test.getTime() - now.getTime()) / 1000 / 60 / 60 / 24;
  }

  onDateSelected(): void {
    this.dayRemained = this.calculateRemainedDays(this.today, this.testDate);
  }

  toSave() {
    this.changeEdited();
    if (this.progress.targetReading == null) {this.progress.targetReading = 0; }
    if (this.progress.targetListening == null) {this.progress.targetListening = 0; }
    if (this.progress.targetWriting == null) {this.progress.targetWriting = 0; }
    if (this.progress.targetSpeaking == null) {this.progress.targetSpeaking = 0; }
    this.sumTarget = Number(this.progress.targetReading) +
      Number(this.progress.targetListening) +
      Number(this.progress.targetSpeaking) +
      Number(this.progress.targetWriting);
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
    this.progress.targetReading = this.checkValue(this.progress.targetReading);
  }
  checkListening() {
    this.progress.targetListening = this.checkValue(this.progress.targetListening);
  }

  checkSpeaking() {
    this.progress.targetSpeaking = this.checkValue(this.progress.targetSpeaking);
  }

  checkWriting() {
    this.progress.targetWriting = this.checkValue(this.progress.targetWriting);
  }
}


