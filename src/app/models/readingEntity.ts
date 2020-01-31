export class ReadingEntity {
  questions: Question[] = [];
  answerChoices: AnswerChoice[] = [];
  correctAnswers: CorrectAnswer[] = [];
}

export class Question {
  id: number;
  question: string;
}

export class AnswerChoice {
  id: number;
  questionNumID: number;
  answerChoice: string;
}

export class CorrectAnswer {
  questionID: number;
  answerID: number;
  explanation: string;
}
