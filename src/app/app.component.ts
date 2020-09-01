import { Component, Inject, OnDestroy, OnInit, Injectable, EventEmitter } from '@angular/core';
import { Observable, Observer, fromEvent, merge, interval, Subscription, Subject,timer } from 'rxjs';
import { map, first,switchMap, take } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { EventService } from "./shared/event.service";
import { StateParameterService } from "./shared/st-parameter.service";
import { FileUploadService } from "./file-upload/upload.service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
/** Service for cross component communication. */
@Injectable()
export class CountdownService {
  startTimer = new Subject<number>();
  timer = this.startTimer.pipe(switchMap(seconds =>
    timer(0, 1000).pipe(map(t => seconds - t),take(seconds + 1))
));
  start(time: number) {
    const seconds = Math.floor(time / 1000);
    this.startTimer.next(seconds);
  }
  timeLeft(): Observable<number> {
    return this.timer;
  }
}
@Component({
  selector: 'pm-root',
  template: `
    <mat-toolbar color="primary">
    <nav class='navbar navbar-expand navbar-dark'>
        <span style="color:white;" class='navbar-brand' routerLinkActive='active' [routerLink]="['/']">{{pageTitle}}</span>
        <ul class=' navbar-nav nav-pills'>
          <li class="nav-item"><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/home']">Home</a></li>
          <li class="nav-item"><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/users']">Citizens</a></li>
          <li class="nav-item"><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/form']">Form</a></li>
        </ul>
    </nav>
    </mat-toolbar>
    <div class='container'>
      <router-outlet></router-outlet>
    </div>
    `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy  {
  pageTitle = 'YARLOMIA';
  val=12000;
  snval=2000;
  autodelay=0;
  private sub:Subscription;
  private check:Subscription;
  private source= interval(this.val);
  test:boolean;
  old:string;
  oldloc:string;
  snackBarRef:MatSnackBarRef<CountdownSnackbarComponent>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'left';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private _http: HttpClient,private stService:StateParameterService,private UpService: FileUploadService,
  private snackBar: MatSnackBar,private countdown: CountdownService,private _sse:EventService,private loc:EventService) {
    this.createOnline$().subscribe(isOnline => {
      if(isOnline){
        this._sse.getUpdates();
        this.val=12000;
        this.test=false;
        this.check=this.source.subscribe(next => {
          if(this.test)
          this.checker();
        });
      }else{
        //this.sub.unsubscribe();
        this.old="";
        this._sse.stopUpdates();
        this.loc.stopUpdates();
        if(this.check)
          this.check.unsubscribe();
        this.openSnackBar("Device Disconnected",'danger-snackbar');
      }
    });
  }
  ngOnInit(): void {
    var busy;
    this.stService.busy.subscribe(foo =>{
      if (!foo && this.old=='yx') {
        busy=false;
        this.openSnackBar("Online Mode");
        this.stService.host="https://yarlomia.ga";
        console.log("Access: busy");
      }else busy=true;
    });
    this.sub=this._sse.returnAsObservable().subscribe(msg=>{
      console.log(msg);
      if(msg=='yx' && msg!=this.old && !busy){
        this.openSnackBar("Online Mode");
        this.stService.host="https://yarlomia.ga";
        this.loc.stopUpdates();
        this.test=false;
        this.old=msg;
        console.log("Access: "+msg);
      }
      else if((msg=="rx" || msg=='nx' || msg=='ex') && msg!=this.old){
        this.loc.getUpdates("http://localhost:3003");
        this.old=msg;
        console.log("Access: "+msg);
      }
      else if (msg=='ex') {
        setTimeout(() =>
        {
          this._sse.getUpdates();
        },
        10000);
        this.old=msg;
      }else if(msg=='y' && msg!=this.oldloc){
        this.stService.host="http://localhost:3003";
        this.openSnackBar("Local Mode",'blue-snackbar');
        this.restore();
        this.test=false;
        this.oldloc=msg;
        console.log("Access: "+msg);
      }
      else if((msg=='r'|| msg=='n' || msg=='e') && msg!=this.oldloc ){
        this.stService.host="";
        this.loc.stopUpdates();
        //this.openSnackBar("Offline Mode",'danger-snackbar',5000);
        this.test=true;
        this.oldloc=msg;
        console.log("Access: "+msg);
      }
      if(msg=='yx' && msg!=this.old)
        this.old=msg;
    });
  }
  ngOnDestroy(): void {
    this._sse.stopUpdates();
    this.loc.stopUpdates();
    this.sub.unsubscribe();
    this.check.unsubscribe();
  }
  restore(): void{
    if(this.stService.form)
    this._http.post(this.stService.host+'/api/form', this.stService.form).subscribe(data => {
      setTimeout(() =>
            {
              this.openSnackBar("Personal Informations Saved",'blue-snackbar',3000);
            },
            3000);
    });
    if (this.stService.pic) {
      this.UpService.postImg(this.stService.pic,this.stService.id,this.stService.host,"pic").subscribe(
        (event: any) => {
            setTimeout(() =>
            {
              this.openSnackBar("Portrait Uploaded Successfully!",'blue-snackbar',3000);
            },
            6000);
        });
    }
  }
  openSnackBar(msg:string,color='success-snackbar',val=10000) {
    this.snackBar.open(msg,"OK", {
      duration: val,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [color]
    });
  }
  errsnackbar(msg:string,duration:number=10000,color:string='danger-snackbar'){
    if (this.snackBarRef)
      this.snackBarRef.dismiss();
    this.snackBarRef =this.snackBar.openFromComponent(CountdownSnackbarComponent, {duration,
      data: msg,
      panelClass: [color],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition});
    this.countdown.start(duration);
    this.snackBarRef.onAction().subscribe(() => {
      this.snval*=2;
      this.val*=2;
      this.check.unsubscribe();
      this.source = interval(this.val);
      this.checker(this.val-this.snval);
      this.check=this.source.subscribe(next => {
        this.checker(this.val-this.snval);
      });
    });
  }
  infosnack(msg:string="Connecting..."){
    this.snackBar.open(msg,"OK", {
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['blue-snackbar']
    });
  }
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
  checker(val=10000):void{
      this._http.get("http://localhost:3003/api/db", { observe: 'response' })
      .pipe(first())
      .subscribe(resp => {
        if (resp.status === 200 ) {
          this.loc.getUpdates("http://localhost:3003");
          console.log("back to local mode");
        }
      }, err => {
        console.log("still offline mode");
        this.infosnack();
        setTimeout(() =>
        {
          this.errsnackbar("Offline Mode",val);
        },
        2000);
      });
  }
}
/** Component opened inside a snackbar. */
@Component({
  selector: 'snackbar',
  template: `
  <button class="pull-right" (click)="snackBarRef.dismissWithAction()" mat-stroked-button color="warn">RETRY NOW</button>
  <span >{{data}} <br> Retrying in {{ timeLeft$ | async }} seconds...</span>
  `
})
export class CountdownSnackbarComponent {

  timeLeft$ = this.countdown.timeLeft();

  constructor(private countdown: CountdownService,@Inject(MAT_SNACK_BAR_DATA) public data: any,
  public snackBarRef: MatSnackBarRef<CountdownSnackbarComponent>) { }
}
