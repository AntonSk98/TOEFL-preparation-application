import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ReadingPractice} from '../models/readingPractice';
import {ReadingService} from '../services/reading.service';
import {Subscription} from 'rxjs';
import {Sections} from '../models/sections';
import {Speaking} from '../models/speaking';
import {Writing} from '../models/writing';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {ListeningService} from '../services/listening.service';
import {SpeakingService} from '../services/speaking.service';
import {WritingService} from '../services/writing.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit, OnDestroy {
  @Input() identification: string;
  loading: boolean;
  topics = [];
  subscriptions = new Subscription();
  sections: Sections = new Sections();
  speaking: Speaking = new Speaking();
  writing: Writing = new Writing();
  displayedColumns = ['N', 'Question', 'Score', 'Action'];

  constructor(
    private readingService: ReadingService,
    private listeningService: ListeningService,
    private speakingService: SpeakingService,
    private writingService: WritingService
  ) { }

  ngOnInit() {
    this.taskResolver(this.identification);
  }

  taskResolver = (identification: string) => {
    switch (identification) {
      case this.sections.reading: { this.getReadingTasks(); break; }
      case this.sections.listening: { this.getListeningTasks(); break; }
      case this.sections.speaking: { this.getSpeakingTasks(); break; }
      case this.writing.independentWriting: { this.getIndependentWritingTasks(); break; }
      case this.writing.integratedWriting: { this.getIntegratedWritingTasks(); break; }
      case this.speaking.speakingOne: { this.getSpeakingOneTasks(); break; }
      case this.speaking.speakingTwo: { this.getSpeakingTwoTasks(); break; }
      case this.speaking.speakingThree: { this.getSpeakingThreeTasks(); break; }
      case this.speaking.speakingFour: { this.getSpeakingFourTasks(); break; }
      case this.speaking.speakingExOne: { this.getSpeakingExOneTasks(); break; }
      case this.speaking.speakingExTwo: { this.getSpeakingExTwoTasks(); break; }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getReadingTasks = () => {
    this.loading = true;
    this.subscriptions.add(this.readingService.getReadingTasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getListeningTasks() {
    this.loading = true;
    this.subscriptions.add(this.listeningService.getListeningTasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingTasks() {
    console.log(this.sections.speaking);
  }

  private getIndependentWritingTasks() {
    this.loading = true;
    this.subscriptions.add(this.writingService.getIndependentWriting().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getIntegratedWritingTasks() {
    this.loading = true;
    this.subscriptions.add(this.writingService.getIntegratedWriting().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingOneTasks() {
    this.loading = true;
    this.subscriptions.add(this.speakingService.getSpeakingOneTasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingTwoTasks() {
    this.loading = true;
    this.subscriptions.add(this.speakingService.getSpeakingTwoTasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingThreeTasks() {
    this.loading = true;
    this.subscriptions.add(this.speakingService.getSpeakingThreeTasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingFourTasks() {
    this.loading = true;
    this.subscriptions.add(this.speakingService.getSpeakingFourTasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingExOneTasks() {
    this.loading = true;
    this.subscriptions.add(this.speakingService.getSpeakingEx1Tasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }

  private getSpeakingExTwoTasks() {
    this.loading = true;
    this.subscriptions.add(this.speakingService.getSpeakingEx2Tasks().subscribe((value: any) => {
      this.loading = false;
      this.topics = value;
    }));
  }
}
