import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import { faTrash, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Sections} from '../models/sections';
import {Speaking} from '../models/speaking';
import {Writing} from '../models/writing';
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
        visibility: 'hidden'
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
export class HomePageComponent implements OnInit, AfterViewInit {
  @Input() completeness = 50;
  @Input() targetScore = 10;
  @Input() averageScore = 100;
  sectionTitle: string;
  speakingSectionTitle = '';
  writingSectionTitle = '';
  faTrash = faTrash;
  faArrowCircleLeft = faArrowCircleLeft;
  faArrowCircleRight = faArrowCircleRight;
  sections: Sections = new Sections();
  speaking: Speaking = new Speaking();
  writing: Writing = new Writing();
  isShown = true;
  constructor(
  ) {
    this.sectionTitle = 'Reading';
  }

  hideShow() {
    this.isShown = !this.isShown;
  }
  ngOnInit() {
  }

  adjustTitle(clickedSection: string) {
    this.sectionTitle = clickedSection;
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

  ngAfterViewInit(): void {
  }
}
