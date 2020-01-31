import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faClock, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {CdTimerComponent, TimeInterface} from 'angular-cd-timer';
import {ReadingService} from '../services/reading.service';
import {AnswerChoice, ReadingEntity} from '../models/readingEntity';

@Component({
  selector: 'app-reading-task',
  templateUrl: './reading-task.component.html',
  styleUrls: ['./reading-task.component.css']
})
export class ReadingTaskComponent implements OnInit, AfterViewInit {
  @ViewChild('timer', {static: false}) timer: CdTimerComponent;
  @ViewChild('studyText', {static: false}) studyText: ElementRef;
  @ViewChild('question', {static: false}) question: ElementRef;
  readingNumber: number;
  faClock = faClock;
  faBackward = faArrowLeft;
  passage: string;
  loading = true;
  readingEntity: ReadingEntity = new ReadingEntity();
  questionIndex = 0;
  selectedChoices: AnswerChoice[] = [];

  constructor(
    private route: ActivatedRoute,
    private readingService: ReadingService
  ) {
  }

  ngOnInit() {
    this.readingNumber = this.route.snapshot.params.id;
    this.readingService.getReadingQuestionsByID(this.readingNumber).subscribe((value: ReadingEntity) => this.readingEntity = value);
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.readingService.getReadingPassageById(this.readingNumber).subscribe((value: string) => {
      this.loading = false;
      this.passage = value;
      this.studyText.nativeElement.insertAdjacentHTML('beforeend', this.addNeededStyles(this.passage));
    });
  }

  stopTimer() {
    setTimeout(() => alert('Your time is up, but since it is just practice feel free to continue :)'), 500);
  }

  moveBack() {
    if (this.questionIndex > 0) {
      this.questionIndex--;
      this.insertComplexQuestions(this.questionIndex, this.readingEntity.questions[this.questionIndex].question);
    }
  }

  moveForward() {
    if (this.questionIndex === 9) {
      this.question.nativeElement.innerHTML = '';
    }
    if (this.questionIndex < 10) {
      this.questionIndex++;
      if (this.questionIndex !== 10) {
        this.insertComplexQuestions(this.questionIndex, this.readingEntity.questions[this.questionIndex].question);
      }
    }
  }

  addNeededStyles(passage: string): string {
    return passage.split('"highlighted-underline"')
      .join('"highlighted-underline" style="font-weight: bold; text-decoration: underline"');
  }

  insertComplexQuestions(questionNumber: number, question: string) {
    this.question.nativeElement.innerHTML = '';
    if (questionNumber === 8 || questionNumber === 9) {
      this.question.nativeElement.insertAdjacentHTML('beforeend', question);
    }
  }

  getChoicesForQuestion(questionNumber: number) {
    return this.readingEntity.answerChoices.filter(value => value.questionNumID === questionNumber);
  }

  onChange(choice: AnswerChoice, checked: boolean) {
    if (this.questionIndex < 9) {
      this.manipulateBySingleChoices(choice, checked);
    } else {
      this.manipulateByMultipleChoices(choice, checked);
    }
  }
  manipulateBySingleChoices(choice: AnswerChoice, checked: boolean) {
    if (this.selectedChoices.filter((value: AnswerChoice) => value.answerChoice === choice.answerChoice
      || value.questionNumID === choice.questionNumID).length !== 0) {
      const index = this.selectedChoices.findIndex((value: AnswerChoice) => value.answerChoice === choice.answerChoice
        || value.questionNumID === choice.questionNumID);
      checked === true ? this.selectedChoices[index] = choice : this.selectedChoices.splice(index, 1);
    } else {
      this.selectedChoices.push(choice);
    }
  }
  manipulateByMultipleChoices(choice: AnswerChoice, checked: boolean) {
    if (this.selectedChoices.filter((value: AnswerChoice) => value.answerChoice === choice.answerChoice).length !== 0) {
      const index = this.selectedChoices.findIndex((value: AnswerChoice) => value.answerChoice === choice.answerChoice);
      checked === true ? this.selectedChoices[index] = choice : this.selectedChoices.splice(index, 1);
    } else {
      this.selectedChoices.push(choice);
    }
  }

  checkSelected(choice: AnswerChoice): boolean {
    if (this.selectedChoices.length > 0) {
      return !!(this.selectedChoices.find(value => value.answerChoice === choice.answerChoice));
    } else { return false; }
  }
}



