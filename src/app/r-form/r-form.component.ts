import { Component } from '@angular/core';

import { QuestionService } from './question.service';
import { QuestionBase } from './question-base';
import { Observable } from 'rxjs';
/** Form Component at /form */
@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-dynamic-form [questions]="questions$ | async"></app-dynamic-form>
    </div>
  `,
  providers:  [QuestionService]
})
export class RFormComponent {
  /** Observable of QuestionBase objects in an array */
  questions$: Observable<QuestionBase<any>[]>;
  /**
   * Constructs the form component with the questions retreived from the injectable
   * @param service Instance of the QuestionService Injectable
   */
  constructor(service: QuestionService) {
    this.questions$ = service.getQuestions();
  }
}
