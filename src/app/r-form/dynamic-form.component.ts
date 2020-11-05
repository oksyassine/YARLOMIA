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
import { EventService } from '../shared/event.service';

/** DynamicFormComponent to handle the formgroup */
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class DynamicFormComponent implements OnInit {
  /** Input Questions  */
  @Input() questions: QuestionBase<string>[] = [];
  /** FormGroup instance */
  form: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  /**
   * Constructs the DynamicForm Component
   * @param qcs Instance of the QuestionControlService Object
   * @param router use Router service to navigate among views
   * @param stService use the fields in the bag to store the citizen id and emit an event using the event emitter
   * @param http HTTP Client
   */
  constructor(/*private cookieService: CookieService,*/private stService :StateParameterService,
    private qcs: QuestionControlService,private router : Router,private http: HttpClient) { }
  /** Initiate the component by getting the formgroup from the questionbase objects */
  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
    //const start = Date.now();
    //this.cookieService.set( 'cin', "this.stService.id",start+60,'/',this.hostname,true,"None");
    //console.log(this.cookieService.getAll());
  }
  /** Submit the form when the user hits the submit button */
  onSubmit() {
    //this.payLoad = JSON.stringify(this.form.getRawValue());
    const obj= this.form.getRawValue();
    obj["_id"]= "dossier_"+obj['cin'];
    this.http.post(this.stService.host+'/api/form', obj).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.stService.id=obj['_id'];//JSON.stringify(data);
      this.stService.form=obj;
      //if(this.stService.host==EventService.local)
      this.stService.busy.emit(true);
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
