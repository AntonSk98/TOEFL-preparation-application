import { Component, OnInit, Input } from '@angular/core';
import { faTrash, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @Input() completeness = 50;
  @Input() targetScore = 10;
  @Input() averageScore = 100;
  sectionTitle: string;
  speakingSectionTitle: string;
  writingSectionTitle: string;
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
    this.speakingSectionTitle = 'Speaking 1';
    this.writingSectionTitle = 'Integrated writing';
  }

  hideShow() {
    this.isShown = !this.isShown;
  }
  ngOnInit() {
  }

  adjustTitle(clickedSection: string) {
    this.sectionTitle = clickedSection;
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
}

class Sections {
  progress = 'Schedule & Target Score';
  reading = 'Reading';
  listening = 'Listening';
  speaking = 'Speaking';
  writing = 'Writing';
}

class Speaking {
  speakingOne = 'Speaking 1';
  speakingTwo = 'Speaking 2';
  speakingThree = 'Speaking 3';
  speakingFour = 'Speaking 4';
  speakingExOne = 'Ex. 1';
  speakingExTwo = 'Ex. 2';
}

class Writing {
  integratedWriting = 'Integrated writing';
  independentWriting = 'Independent writing';
}
