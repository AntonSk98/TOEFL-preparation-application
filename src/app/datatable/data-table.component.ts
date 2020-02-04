import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ReadingPractice} from '../models/readingPractice';
import {ReadingService} from '../services/reading.service';
import {Subscription} from 'rxjs';
import {Sections} from '../models/sections';
import {Speaking} from '../models/speaking';
import {Writing} from '../models/writing';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-datatable',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit, OnDestroy {
  @Input() identification: string;
  loading: boolean;
  passages: ReadingPractice[];
  readingSubscription = new Subscription();
  sections: Sections = new Sections();
  speaking: Speaking = new Speaking();
  writing: Writing = new Writing();
  displayedColumns = ['N', 'Question', 'Score', 'Action'];

  constructor(private readingService: ReadingService, private ref: ChangeDetectorRef ) { }

  ngOnInit() {
    this.taskResolver(this.identification);
  }

  getReadingTasks = () => {
    this.loading = true;
    this. readingSubscription = this.readingService.getReadingTasks().subscribe((value: ReadingPractice[]) => {
      this.loading = false;
      this.passages = value;
    });
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
    this.readingSubscription.unsubscribe();
  }

  private getListeningTasks() {
    console.log(this.sections.listening);
  }

  private getSpeakingTasks() {
    console.log(this.sections.speaking);
  }

  private getIndependentWritingTasks() {
    console.log(this.writing.independentWriting);
  }

  private getIntegratedWritingTasks() {
    console.log(this.writing.integratedWriting);
  }

  private getSpeakingOneTasks() {
    console.log(this.speaking.speakingOne);
  }

  private getSpeakingTwoTasks() {
    console.log(this.speaking.speakingTwo);
  }

  private getSpeakingThreeTasks() {
    console.log(this.speaking.speakingThree);
  }

  private getSpeakingFourTasks() {
    console.log(this.speaking.speakingFour);
  }

  private getSpeakingExOneTasks() {
    console.log(this.speaking.speakingExOne);
  }

  private getSpeakingExTwoTasks() {
    console.log(this.speaking.speakingExTwo);
  }
}
