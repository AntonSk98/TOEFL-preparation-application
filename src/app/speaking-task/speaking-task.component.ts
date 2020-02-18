import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Speaking} from '../models/speaking';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {CdTimerComponent} from 'angular-cd-timer';

@Component({
  selector: 'app-speaking-task',
  templateUrl: './speaking-task.component.html',
  styleUrls: ['./speaking-task.component.css']
})
export class SpeakingTaskComponent implements OnInit {

  @ViewChild('timer', {
    static: false
  }) timer: CdTimerComponent;
  isTimerPaused = true;
  toResetTimer = true;
  faPlay = faPlay;
  speakingNumber: number;
  speakingTask: string;
  speaking: Speaking = new Speaking();
  hardCode = `The peak-end rule describes a theory that humans judge past experiences based upon a single high moment and the end of that event rather than judging by a sum of the event in its entirety. Whether that peak moment is good or bad, coupled with their feelings at the end of the event, determine their overall perception of an experience being pleasant or unpleasant.`;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.speakingNumber = this.route.snapshot.params.id;
    this.speakingTask = this.route.snapshot.params.type;
    console.log(this.speakingTask);
  }

  completeTimer() {
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
}
