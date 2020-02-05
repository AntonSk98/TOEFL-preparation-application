import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { faArrowLeft, faClock } from '@fortawesome/free-solid-svg-icons';
import {CdTimerComponent} from 'angular-cd-timer';

@Component({
  selector: 'app-listening-task',
  templateUrl: './listening-task.component.html',
  styleUrls: ['./listening-task.component.css']
})
export class ListeningTaskComponent implements OnInit, AfterViewInit {
  @ViewChild('timer', {
    static: false
  }) timer: CdTimerComponent;
  listeningNumber: number;
  listeningType: string;
  listeningTitle: string;
  timerStarted = false;
  showDirections = true;
  isAudioPlaying = false;
  faClock = faClock;
  faBackward = faArrowLeft;
  listeningScore = -1;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.listeningNumber = this.route.snapshot.params.id;
    this.listeningType = this.route.snapshot.params.type;
    this.listeningTitle = this.route.snapshot.params.title;
  }

  ngAfterViewInit(): void {
  }

  startTimer() {
    this.timerStarted = true;
    if (this.timer) {
      this.timer.start();
    } else { setTimeout(() => this.timer.start(), 1000); }
  }

  stopTimer() {
    if (!this.timerStarted) {
      this.timer.reset();
      this.timer.stop();
    }
  }

  completeTimer() {
    setTimeout(() => alert('Your time is up, but since it is just practice feel free to continue :)'), 500);
  }

  startTask() {
    this.showDirections = false;
    this.isAudioPlaying = true;
  }

  pasteTodayTopic(): string {
    if (this.listeningType === 'lecture') {
      return this.listeningTitle.replace('Lecture', 'Today\'s topic');
    } else { return this.listeningTitle; }
  }
}
