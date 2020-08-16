import { Injectable } from '@angular/core';

import { AreaQuestion } from './question-loc';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { DropdownQuestion } from './question-dropdown';

import { of } from 'rxjs';

@Injectable()
export class QuestionService {

  // TODO: get from a remote source of question metadata
  getQuestions() {

    const questions: QuestionBase<string>[] = [

      new DropdownQuestion({
        key: 'sexe',
        label: 'Gender',
        required: true,
        options: [
          {key: 'M',  value: 'Man'},
          {key: 'F',  value: 'Woman'}
        ],
        order: 5
      }),
      new AreaQuestion({
        key: 'address',
        label: 'Address',
        required: true,
        order: 4
      }),
      new TextboxQuestion({
        key: 'cin',
        label: 'CIN',
        required: true,
        order: 3
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        order: 2
      })
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
