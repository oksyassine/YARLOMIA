import { Component, Input, OnInit,Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { StateParameterService } from "../shared/st-parameter.service";
import { CookieService } from 'ngx-cookie-service';
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
  obj:JSON;
  constructor(@Inject('HOSTNAME') private hostname: string,private cookieService: CookieService,private stService :StateParameterService,private qcs: QuestionControlService,private router : Router,private http: HttpClient,location: Location) {
    //this.location = location;
    if (hostname.includes('localhost'))
      this.rootURL='http://'+hostname;
    else
      this.rootURL='https://'+hostname;
    console.log(this.rootURL);
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
    //const start = Date.now();
    //this.cookieService.set( 'cin', "this.stService.id",start+60,'/',this.hostname,true,"None");
    //console.log(this.cookieService.getAll());
  }

  onSubmit() {
    //this.payLoad = JSON.stringify(this.form.getRawValue());
    this.http.post('/api/form', this.form.getRawValue()).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      //console.log(JSON.parse(JSON.stringify(data)));
      //this.obj=JSON.parse(JSON.stringify(data));
      this.stService.id=JSON.stringify(data);//this.obj['cin'];
      console.log(this.stService.id);
      const start = Date.now();
      this.cookieService.set( 'data', this.stService.id ,start+60000,'/',this.hostname,true);
      //console.log(this.cookieService.getAll());
    });
    setTimeout(() =>
    {
      this.router.navigate(["/form/pic"]);
    },
    2000);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
