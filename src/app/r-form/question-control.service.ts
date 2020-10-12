import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-base';
/** QuestionControlService Injectable */
@Injectable()
export class QuestionControlService {
  constructor() { }
  /**
   * Constructs a FormGroup from the questionBase objects
   * @param questions Questions from QuestionBase objects in an array
   */
  toFormGroup(questions: QuestionBase<string>[] ) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
                                              : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
