import {Component, OnInit, Input, ViewChild, AfterViewInit, OnChanges, OnDestroy} from '@angular/core';
import { faTrash, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Sections} from '../models/sections';
import {Speaking} from '../models/speaking';
import {Writing} from '../models/writing';
import {ReadingService} from '../services/reading.service';
import {TargetSettings} from '../models/targetSettings';
import {TargetService} from '../services/target.service';
import {ListeningService} from '../services/listening.service';
import {SpeakingService} from '../services/speaking.service';
import {Subscription} from 'rxjs';
import {WritingService} from "../services/writing.service";
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    trigger('toggleMenu', [
      state('open', style({
        width: '20%',
        opacity: '1'
      })),
      state('closed', style({
        width: '0%',
        opacity: '0.4',
        visibility: 'hidden',
      })),
      transition('open => closed', [
        animate('.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ])
  ]
})
export class HomePageComponent implements OnInit, OnDestroy {
  @Input() completeness: number;
  @Input() targetScore = new TargetScore();
  @Input() averageScore = new AverageScore();
  sectionTitle = 'Reading';
  speakingSectionTitle = '';
  writingSectionTitle = '';
  faTrash = faTrash;
  faArrowCircleLeft = faArrowCircleLeft;
  faArrowCircleRight = faArrowCircleRight;
  subscriptions = new Subscription();
  sections: Sections = new Sections();
  speaking: Speaking = new Speaking();
  writing: Writing = new Writing();
  isShown = true;
  constructor(
    private listeningService: ListeningService,
    private readingService: ReadingService,
    private targetService: TargetService,
    private speakingService: SpeakingService,
    private writingService: WritingService) {
  }

  hideShow() {
    this.isShown = !this.isShown;
  }
  ngOnInit() {
    this.getProgressInfo();
  }

  adjustTitle(clickedSection: string) {
    this.sectionTitle = clickedSection;
    if (clickedSection === this.sections.reading) {
      this.subscriptions.add(
        this.readingService.getCompleteness().subscribe((value: number) => this.completeness = value)
      );
    }
    if (clickedSection === this.sections.listening) {
      this.subscriptions.add(
        this.listeningService.getCompleteness().subscribe((value: number) => this.completeness = value)
      );
    }
    if (clickedSection === this.sections.speaking) {
      this.subscriptions.add(
        this.speakingService.getCompleteness().subscribe((value: number) => this.completeness = value)
      );
    }
    if (clickedSection === this.sections.writing) {
      this.subscriptions.add(
        this.writingService.getCompleteness().subscribe((value: number ) => this.completeness = value)
      );
    }
    if (clickedSection === this.sections.writing) {
      this.writingSectionTitle = 'Integrated writing';
      this.speakingSectionTitle = '';
    } else if (clickedSection === this.sections.speaking) {
      this.speakingSectionTitle = 'Speaking 1';
      this.writingSectionTitle = '';
    } else if (clickedSection !== this.sections.writing) {
      this.writingSectionTitle = '';
      this.speakingSectionTitle = '';
    } else if (clickedSection !== this.sections.speaking) {
      this.speakingSectionTitle = '';
      this.writingSectionTitle = '';
    }
  }

  defineTypeOfProgressBar(): string {
    if (this.completeness <= 25) {
      return 'danger';
    } else if (this.completeness >= 75) {
      return 'success'; } else { return 'warning'; }
  }

  adjustSpeakingTitle(clickedSpeakingSection: string) {
    this.speakingSectionTitle = clickedSpeakingSection;
  }

  adjustWritingTitle(clickedWritingSection: string) {
    this.writingSectionTitle = clickedWritingSection;
  }

  getProgressInfo() {
    this.subscriptions.add(
      this.readingService.getCompleteness().subscribe((value: number) => this.completeness = value)
    );
    this.subscriptions.add(this.targetService.getTargetScore().subscribe((value: TargetSettings) => {
      this.targetScore.targetReadingScore = value.targetReading;
      this.targetScore.targetListeningScore = value.targetListening;
      this.targetScore.targetSpeakingScore = value.targetSpeaking;
      this.targetScore.targetWritingScore = value.targetWriting;
    }));
    this.subscriptions.add(
      this.readingService.getAverageScore().subscribe((value: number) => this.averageScore.averageReadingScore = value )
    );
    this.subscriptions.add(
      this.listeningService.getAverageScore().subscribe((value: number) => this.averageScore.averageListeningScore = value )
    );
    this.subscriptions.add(
      this.speakingService.getAverageScore().subscribe((value: number) => this.averageScore.averageSpeakingScore = value)
    );
    this.subscriptions.add(
      this.writingService.getAverageScore().subscribe((value: number) => this.averageScore.averageWritingScore = value)
    );
  }

  getTargetScore(targetSettings: TargetSettings) {
    this.targetScore.targetReadingScore = targetSettings.targetReading;
    this.targetScore.targetListeningScore = targetSettings.targetListening;
    this.targetScore.targetSpeakingScore = targetSettings.targetSpeaking;
    this.targetScore.targetWritingScore = targetSettings.targetWriting;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

class TargetScore {
  targetReadingScore: number;
  targetListeningScore: number;
  targetSpeakingScore: number;
  targetWritingScore: number;
}
class AverageScore {
  averageReadingScore = 0;
  averageListeningScore = 1;
  averageSpeakingScore = 2;
  averageWritingScore = 3;
}
