export class ListeningEntity {
  listeningQuestions: ListeningQuestions[];
  answerChoiceListening: AnswerChoiceListening[];
  correctAnswersListening: CorrectAnswersListening[];
}

export class ListeningQuestions {
  id: number;
  question: string;
  audioPath: string;
}

export class AnswerChoiceListening {
  id: number;
  answerChoice: string;
  questionNumID: number;
  isCorrect: boolean;
}

export class CorrectAnswersListening {
  questionID: number;
  answerID: number;
  explanation: string;
}
