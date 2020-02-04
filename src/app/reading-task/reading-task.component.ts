import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft, faClock } from '@fortawesome/free-solid-svg-icons';
import { CdTimerComponent } from 'angular-cd-timer';
import { ReadingService } from '../services/reading.service';
import { AnswerChoice, CorrectAnswer, ReadingEntity } from '../models/readingEntity';

@Component({
  selector: 'app-reading-task',
  templateUrl: './reading-task.component.html',
  styleUrls: ['./reading-task.component.css']
})
export class ReadingTaskComponent implements OnInit, AfterViewInit {
  @ViewChild('timer', {
    static: false
  }) timer: CdTimerComponent;
  @ViewChild('studyText', {
    static: false
  }) studyText: ElementRef;
  @ViewChild('question', {
    static: false
  }) question: ElementRef;
  readingNumber: number;
  faClock = faClock;
  faBackward = faArrowLeft;
  passage: string;
  loading = true;
  readingEntity: ReadingEntity = new ReadingEntity();
  questionIndex = 0;
  readingScore = -1;
  selectedChoices: AnswerChoice[] = [];
  correctAnswers: UserAnswer[] = [];

  constructor(
    private route: ActivatedRoute,
    private readingService: ReadingService
  ) {}

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
    if (this.selectedChoices.filter((value: AnswerChoice) => value.answerChoice === choice.answerChoice ||
      value.questionNumID === choice.questionNumID).length !== 0) {
      const index = this.selectedChoices.findIndex((value: AnswerChoice) => value.answerChoice === choice.answerChoice ||
        value.questionNumID === choice.questionNumID);
      checked === true ? this.selectedChoices[index] = choice : this.selectedChoices.splice(index, 1);
    } else {
      this.selectedChoices.push(choice);
    }
  }

  manipulateByMultipleChoices(choice: AnswerChoice, checked: boolean) {
    if (this.selectedChoices.filter(value => value.questionNumID === this.readingNumber * 10).length < 3) {
      if (this.selectedChoices.filter((value: AnswerChoice) => value.answerChoice === choice.answerChoice).length !== 0) {
        const index = this.selectedChoices.findIndex((value: AnswerChoice) => value.answerChoice === choice.answerChoice);
        checked === true ? this.selectedChoices[index] = choice : this.selectedChoices.splice(index, 1);
      } else {
        this.selectedChoices.push(choice);
      }
    } else {
      this.selectedChoices = this.selectedChoices.filter(value => value.questionNumID !== this.readingNumber * 10);
      this.selectedChoices.push(choice);
    }
  }

  checkSelected(choice: AnswerChoice): boolean {
    if (this.selectedChoices.length > 0) {
      return !!(this.selectedChoices.find(value => value.answerChoice === choice.answerChoice));
    } else {
      return false;
    }
  }

  viewResults() {
    this.readingScore = this.composeResultArray();
    this.questionIndex = 0;
    const readingScoreInPercent = Math.round((this.readingScore / (this.readingEntity.questions.length + 1) * 100) * 100) / 100;
    this.readingService.updateReadingScoreByID(this.readingNumber, readingScoreInPercent).subscribe();
  }

  composeResultArray(): number {
    this.correctAnswers = [];
    const multipleAnswers = [];
    let score = 0;
    let scoreForMultipleQuestion = 0;
    this.selectedChoices.sort((a: AnswerChoice, b: AnswerChoice) => a.questionNumID - b.questionNumID);
    this.selectedChoices.forEach((answerChoice: AnswerChoice) => {
      this.readingEntity.correctAnswers.forEach((correctAnswer: CorrectAnswer) => {
        if (correctAnswer.questionID < this.readingNumber * 10) { // only for singular choices
          score += this.incrementScoreForSingularChoice(correctAnswer, answerChoice);
        } else {
          if (this.selectedChoices.filter(value => value.questionNumID === this.readingNumber * 10).length <= 3) {
            if (answerChoice.questionNumID === correctAnswer.questionID &&
              answerChoice.id === correctAnswer.answerID) {
              multipleAnswers.push(this.setCorrectAnswer(correctAnswer, answerChoice));
              scoreForMultipleQuestion++;
            } else if (answerChoice.questionNumID === correctAnswer.questionID) {
              multipleAnswers.push(this.setWrongAnswer(correctAnswer, answerChoice));
            }
          }
        }
      });
    });
    if (scoreForMultipleQuestion === 3) {
      score = score + 2;
    }
    if (scoreForMultipleQuestion === 2) {
      score = score + 1;
    }
    this.correctAnswers.push(...this.filterMultipleChoices(multipleAnswers));
    return score;
  }

  incrementScoreForSingularChoice(correctAnswer: CorrectAnswer, answerChoice: AnswerChoice): number {
    let score = 0;
    if (answerChoice.questionNumID === correctAnswer.questionID && answerChoice.id === correctAnswer.answerID) {
      this.correctAnswers.push(this.setCorrectAnswer(correctAnswer, answerChoice));
      score++;
    } else if (answerChoice.questionNumID === correctAnswer.questionID) {
      this.correctAnswers.push(this.setWrongAnswer(correctAnswer, answerChoice));
    }
    return score;
  }

  setCorrectAnswer(correctAnswer: CorrectAnswer, answerChoice: AnswerChoice): UserAnswer {
    return new UserAnswer(
      answerChoice.id,
      correctAnswer.questionID,
      answerChoice.answerChoice,
      true
    );
  }

  setWrongAnswer(correctAnswer: CorrectAnswer, answerChoice: AnswerChoice): UserAnswer {
    return new UserAnswer(
      answerChoice.id,
      correctAnswer.questionID,
      answerChoice.answerChoice,
      false
    );
  }

  filterMultipleChoices(repetitiveUserAnswers: UserAnswer[]): UserAnswer[] {
    const uniqueUserAnswers: UserAnswer[] = [];
    repetitiveUserAnswers.forEach(value => {
      if (value.isCorrect === true && uniqueUserAnswers.findIndex(val => val.id === value.id) === -1) {
        uniqueUserAnswers.push(value);
      }
    });
    repetitiveUserAnswers.forEach(value => {
      if (uniqueUserAnswers.findIndex(val => val.id === value.id) === -1) {
        uniqueUserAnswers.push(value);
      }
    });
    return uniqueUserAnswers;
  }

  defineColorForAnswerChoice(choice: AnswerChoice): string {
    if (this.correctAnswers.findIndex(value => value.answerChoice === choice.answerChoice && value.isCorrect === true) !== -1) {
      return '#54B76E';
    } else if (this.correctAnswers.findIndex(value => value.answerChoice === choice.answerChoice && value.isCorrect === false) !== -1) {
      return '#EB2124';
    } else if (this.readingEntity.correctAnswers.findIndex(value => value.answerID === choice.id) !== -1) {
      return '#5B5EA6';
    } else {
      return '';
    }
  }

  pasteCorrectAnswerLetter(): string {
    const questionNumID = 10 * (this.readingNumber - 1) + this.questionIndex + 1;
    const correctAnswerID = this.readingEntity.correctAnswers.find(value => value.questionID === questionNumID).answerID;
    return this.calculateLetterForSingularQuestions(correctAnswerID);
  }

  pasteCorrectAnswersForMultiple() {
    let correctAnswers = '';
    const lastNumber = 10 * this.readingNumber;
    const result = this.readingEntity.correctAnswers.filter(value => value.questionID === lastNumber);
    result.forEach(value => {
      correctAnswers = correctAnswers + this.readingEntity.answerChoices
        .find(answerChoice => answerChoice.id === value.answerID).answerChoice.slice(0, 1);
    });
    return correctAnswers;
  }

  pasteSelectedAnswerLetter(): string {
    const questionNumID = 10 * (this.readingNumber - 1) + this.questionIndex + 1;
    const correctAnswerID = this.selectedChoices.find(value => value.questionNumID === questionNumID);
    if (correctAnswerID) {
      return this.calculateLetterForSingularQuestions(correctAnswerID.id);
    } else {
      return 'Not Answered';
    }
  }

  pasteSelectedAnswersForMultiple() {
    let selectedAnswers = '';
    const lastNumber = 10 * this.readingNumber;
    const selectedChoices = this.selectedChoices.filter(value => value.questionNumID === lastNumber);
    if (selectedChoices.length) {
      selectedChoices.forEach(value => {
        selectedAnswers = selectedAnswers + value.answerChoice.slice(0, 1);
      });
      return selectedAnswers;
    } else {
      return 'Not Answered';
    }
  }

  pasteAnswerExplanation(): string {
    const questionNumID = 10 * (this.readingNumber - 1) + this.questionIndex + 1;
    return this.readingEntity.correctAnswers.find(value => value.questionID === questionNumID).explanation;
  }

  calculateLetterForSingularQuestions(questionNumber: number): string {
    let counter = 0;
    while (true) {
      if (counter % 4 === 0 && counter >= questionNumber) {
        break;
      }
      counter++;
    }
    if (counter === questionNumber) {
      return 'D';
    }
    if (counter - 1 === questionNumber) {
      return 'C';
    }
    if (counter - 2 === questionNumber) {
      return 'B';
    }
    if (counter - 3 === questionNumber) {
      return 'A';
    }
  }
}

class UserAnswer {
  id: number;
  questionNumID: number;
  answerChoice: string;
  isCorrect: boolean;

  constructor(id: number, questionNumID: number, answerChoice: string, isCorrect: boolean) {
    this.id = id;
    this.questionNumID = questionNumID;
    this.answerChoice = answerChoice;
    this.isCorrect = isCorrect;
  }
}
