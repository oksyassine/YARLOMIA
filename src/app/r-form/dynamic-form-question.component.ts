import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
/** Component of each question in the form */
@Component({
  selector: 'app-question',
  styleUrls: ['./input-form.css'],
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  /** Input Question  */
  @Input() question: QuestionBase<string>;
  /** Input FormGroup */
  @Input() form: FormGroup;
  /** Validate the Question */
  get isValid() { return this.form.controls[this.question.key].valid; }
}
