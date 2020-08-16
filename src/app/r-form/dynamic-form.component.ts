import { Component, Input, OnInit,Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

export function hostFactory() { return window.location.hostname; }


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService,Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ,{ provide: 'HOSTNAME', useFactory: hostFactory }]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<string>[] = [];
  form: FormGroup;
  payLoad = '';
  rootURL = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  location: Location;

  constructor(@Inject('HOSTNAME') private hostname: string,private qcs: QuestionControlService,private router : Router,private http: HttpClient,location: Location) {
    //this.location = location;
    if (hostname=='localhost')
      this.rootURL='http://'+hostname;
    else
      this.rootURL='https://'+hostname;
    console.log(this.rootURL);
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    this.http.post(this.rootURL + '/api/form', this.form.getRawValue()).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
    });

    setTimeout(() =>
    {
      this.router.navigate(['/form/pic']);
        },
    2000);

  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
