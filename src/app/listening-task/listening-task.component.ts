import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faArrowLeft, faClock, faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import {CdTimerComponent} from 'angular-cd-timer';
import {
  AnswerChoiceListening,
  CorrectAnswersListening,
  ListeningEntity,
  ListeningQuestions
} from '../models/listeningEntity';
import {ListeningService} from '../services/listening.service';
import {AnswerChoice} from '../models/readingEntity';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-listening-task',
  templateUrl: './listening-task.component.html',
  styleUrls: ['./listening-task.component.css']
})
export class ListeningTaskComponent implements OnInit, OnDestroy {
  @ViewChild('timer', {
    static: false
  }) timer: CdTimerComponent;
  @ViewChild('audio', {
    static: false
  }) audio: ElementRef;
  subscriptions = new Subscription();
  listeningNumber: number;
  listeningType: string;
  listeningTitle: string;
  timerStarted = false;
  showDirections = true;
  isAudioPlaying = false;
  faClock = faClock;
  faPlay = faPlayCircle;
  faBackward = faArrowLeft;
  listeningScore = -1;
  listeningEntity: ListeningEntity;
  questionIndex = 0;
  selectedChoices = [];

  constructor(
    private route: ActivatedRoute,
    private listeningService: ListeningService,
  ) {
  }

  ngOnInit() {
    this.listeningNumber = this.route.snapshot.params.id;
    this.listeningType = this.route.snapshot.params.type;
    this.listeningTitle = this.route.snapshot.params.title;
  }

  startTimer() {
    this.timerStarted = true;
    if (this.timer) {
      this.timer.start();
    } else {
      setTimeout(() => this.timer.start(), 1000);
    }
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
    } else {
      return this.listeningTitle;
    }
  }

  goToQuestions() {
    this.startTimer();
    this.isAudioPlaying = false;
    this.subscriptions.add(this.listeningService.getListeningEntityByID(this.listeningNumber)
      .subscribe((listeningEntity: ListeningEntity) => this.listeningEntity = listeningEntity));
  }

  moveBack() {
    if (this.questionIndex > 0) {
      this.questionIndex--;
    }
  }

  moveForward() {
    if (this.questionIndex < this.listeningEntity.listeningQuestions.length) {
      this.questionIndex++;
    }
  }

  playAudioTask() {
    this.audio.nativeElement.play();
  }

  getChoicesForQuestion(questionID: number): AnswerChoiceListening[] {
    return this.listeningEntity.answerChoiceListening.filter((value: AnswerChoiceListening) => value.questionNumID === questionID);
  }

  isSingularQuestion(questionID: number): boolean {
    return this.listeningEntity.correctAnswersListening
      .filter((value: CorrectAnswersListening) => value.questionID === questionID).length === 1;
  }

  checkSelected(choice: AnswerChoiceListening) {
    if (this.selectedChoices.length > 0) {
      return !!(this.selectedChoices.find(value => value.answerChoice === choice.answerChoice));
    } else {
      return false;
    }
  }

  onChange(choice: AnswerChoiceListening, checked: boolean) {
    if (this.isSingularQuestion(this.listeningEntity.listeningQuestions[this.questionIndex].id) === true) {
      this.manipulateBySingleChoice(choice, checked);
    } else {
      this.manipulateBuMultipleChoice(choice, checked);
    }
  }
  manipulateBySingleChoice(choice: AnswerChoiceListening, checked: boolean) {
    if (this.selectedChoices.filter((value: AnswerChoiceListening) => value.answerChoice === choice.answerChoice ||
      value.questionNumID === choice.questionNumID).length !== 0) {
      const index = this.selectedChoices.findIndex((value: AnswerChoiceListening) => value.answerChoice === choice.answerChoice ||
        value.questionNumID === choice.questionNumID);
      checked === true ? this.selectedChoices[index] = choice : this.selectedChoices.splice(index, 1);
    } else {
      this.selectedChoices.push(choice);
    }
  }
  manipulateBuMultipleChoice(choice: AnswerChoiceListening, checked: boolean) {
    checked ?
      this.selectedChoices.push(choice) :
      this.selectedChoices = this.selectedChoices.filter((value: AnswerChoiceListening) => value.answerChoice !== choice.answerChoice);
  }

  viewResults() {
    this.selectedChoices.sort((a: AnswerChoiceListening, b: AnswerChoiceListening) => a.questionNumID - b.questionNumID);
    this.selectedChoices.forEach((answerChoice: AnswerChoiceListening) => {
      this.gradeSelectedChoice(answerChoice);
    });
    this.calculateScoreForSession();
    this.questionIndex = 0;
    const listeningScoreInPercent = Math.round((this.listeningScore / this.getListeningScore() * 100) * 100) / 100;
    this.subscriptions.add(this.listeningService.updateListeningScoreByID(this.listeningNumber, listeningScoreInPercent).subscribe());
  }

  private calculateScoreForSession() {
    let score = 0;
    const selectedQuestionIds = Array.from(new Set(this.selectedChoices.map((value: AnswerChoiceListening) => value.questionNumID)));
    selectedQuestionIds.forEach(questionID => {
      const answers = this.listeningEntity.correctAnswersListening
        .filter((value: CorrectAnswersListening) => value.questionID === questionID).length;
      if (answers === 1 && this.selectedChoices
        .find((value: AnswerChoiceListening) => value.questionNumID === questionID && value.isCorrect === true)) {
        score++;
      }
      if (answers === 2) {
        const firstCondition = this.selectedChoices
          .filter((value: AnswerChoiceListening) => value.questionNumID === questionID && value.isCorrect === true).length === 2;
        const secondCondition = this.selectedChoices
          .filter((value: AnswerChoiceListening) => value.questionNumID === questionID).length <= 2;
        if ( firstCondition && secondCondition ) {
          score++;
        }
      }
      if (answers > 2) {
        const wrongAnswers = this.selectedChoices
          .filter((value: AnswerChoiceListening) => value.questionNumID === questionID && value.isCorrect === false).length;
        const maximumSelected = this.selectedChoices
          .filter((value: AnswerChoiceListening) => value.questionNumID === questionID).length <= answers;
        if ( wrongAnswers === 0 && maximumSelected ) { score = score + 2; }
        if ( wrongAnswers === 1 && maximumSelected ) { score++; }
      }
    });
    this.listeningScore = score;
  }

  private gradeSelectedChoice(answerChoice: AnswerChoiceListening) {
    const index = this.selectedChoices.findIndex(selectedChoice => selectedChoice.answerChoice === answerChoice.answerChoice);
    this.listeningEntity.correctAnswersListening.forEach(value => {
      if (value.questionID === answerChoice.questionNumID && value.answerID === answerChoice.id) {
        this.selectedChoices[index].isCorrect = true;
      }
    });
    if (!this.selectedChoices[index].isCorrect) { this.selectedChoices[index].isCorrect = false; }
  }

  getListeningScore(): number {
    let totalScore = 0;
    const questionsIds = Array.from(new Set(this.listeningEntity.listeningQuestions
      .map((value: ListeningQuestions) => value.id)));
    questionsIds.forEach((questionId: number) => {
      const correctAnswers = this.listeningEntity.correctAnswersListening
        .filter((correctAnswer: CorrectAnswersListening) => correctAnswer.questionID === questionId).length;
      if (correctAnswers <= 2) { totalScore++; }
      if (correctAnswers > 2) { totalScore = totalScore + 2; }
    });
    return totalScore;
  }

  defineColorForAnswerChoice(choice: AnswerChoice): string {
    if (this.selectedChoices
      .findIndex((value: AnswerChoiceListening) => value.answerChoice === choice.answerChoice && value.isCorrect === true) !== -1) {
      return '#54B76E';
    } else if (this.selectedChoices
      .findIndex((value: AnswerChoiceListening) => value.answerChoice === choice.answerChoice && value.isCorrect === false) !== -1) {
      return '#EB2124';
    } else if (this.listeningEntity.correctAnswersListening
      .findIndex((value: CorrectAnswersListening) => value.answerID === choice.id) !== -1) {
      return '#5B5EA6';
    } else {
      return '';
    }
  }

  pasteCorrectAnswerLetter(questionId: number): string {
    const correctAnswerIDs = this.listeningEntity.correctAnswersListening
      .filter((value: CorrectAnswersListening) => value.questionID === questionId)
      .map((value: CorrectAnswersListening) => value.answerID);
    return this.defineLetterByQuestionID(questionId, correctAnswerIDs);
  }

  pasteSelectedAnswerLetter(questionId: number): string {
    if (this.selectedChoices.findIndex((value: AnswerChoiceListening) => value.questionNumID === questionId) === -1) {
      return 'Not answered';
    } else {
      const selectedAnswerIDs = this.selectedChoices
        .filter((value: AnswerChoiceListening) => value.questionNumID === questionId)
        .map((value: AnswerChoiceListening) => value.id);
      return this.defineLetterByQuestionID(questionId, selectedAnswerIDs);
    }
  }

  pasteAnswerExplanation(questionId: number): string {
    return this.listeningEntity.correctAnswersListening
      .find((value: CorrectAnswersListening) => value.questionID === questionId).explanation;
  }

  defineLetterByQuestionID(questionId: number, answerIds: number[]): string {
    let correctAnswers = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    this.listeningEntity.answerChoiceListening
      .filter((value: AnswerChoiceListening) => value.questionNumID === questionId)
      .sort((a: AnswerChoiceListening, b: AnswerChoiceListening) => a.id - b.id)
      .map((value: AnswerChoiceListening, index: number) => {
        return {
          questionId: value.questionNumID,
          answerID: value.id,
          letter: letters[index]
        };
      })
      .forEach(value => {
        if (answerIds.includes(value.answerID)) { correctAnswers = correctAnswers + value.letter; }
      });
    return correctAnswers;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
