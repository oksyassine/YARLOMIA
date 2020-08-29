import { Component, Input, OnInit,Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';
import { LocationStrategy, PathLocationStrategy} from '@angular/common';
import { StateParameterService } from "../shared/st-parameter.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<string>[] = [];
  form: FormGroup;
  payLoad = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  obj:JSON;
  constructor(private cookieService: CookieService,private stService :StateParameterService,
    private qcs: QuestionControlService,private router : Router,private http: HttpClient) { }
  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
    //const start = Date.now();
    //this.cookieService.set( 'cin', "this.stService.id",start+60,'/',this.hostname,true,"None");
    //console.log(this.cookieService.getAll());
  }
  onSubmit() {
    //this.payLoad = JSON.stringify(this.form.getRawValue());
    this.obj = this.form.getRawValue();
    this.obj["_id"]= "dossier_"+this.obj['cin'];
    this.http.post(this.stService.host+'/api/form', this.obj).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.stService.id=this.obj['_id'];//JSON.stringify(data);
      //const start = Date.now();
      //this.cookieService.set( 'data', this.stService.id ,start+60000,'/',this.hostname,true);
      //console.log(this.cookieService.getAll());
      setTimeout(() =>
      {
        this.router.navigate(["/form/pic"]);
      },
      1000);
    });
  }
}
