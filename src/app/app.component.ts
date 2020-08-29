import { Component, Inject, OnDestroy, OnInit, Injectable, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Observer, fromEvent, merge, interval, Subscription, Subject,timer } from 'rxjs';
import { map, first,switchMap, take } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { EventService } from "./shared/event.service";
export function hostFactory() { return window.location.hostname; }

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
  styleUrls: ['./app.component.css'],
  providers: [{ provide: 'HOST', useFactory: hostFactory }]
})
export class AppComponent implements OnInit,OnDestroy  {
  pageTitle = 'YARLOMIA';
  //status = ': ONLINE';
  val=12000;
  snval=2000;
  autodelay=0;
  private sub:Subscription;
  private source = interval(this.val);
  test:boolean;
  rootURL:string;
  snackBarRef:MatSnackBarRef<CountdownSnackbarComponent>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'left';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(@Inject('HOST') private host: string,private _http: HttpClient,
  private snackBar: MatSnackBar,private countdown: CountdownService,private _sse:EventService) {
    if (host=='localhost')
      this.rootURL='http://'+host;
    else
      this.rootURL='http://'+host;
    this.createOnline$().subscribe(isOnline => {
      if(isOnline){
        //this.sub.unsubscribe();
        //this.status=': ONLINE';
        this.val=12000;
        this.checker();
        /*this.sub=this.source.subscribe(next => {
          //this.autodelay+=1000;
          this.checker();
        });*/
      }else{
        //this.status=': OFFLINE';
        this.test=false;
        this.sub.unsubscribe();
        this.infosnack("Device Disconnected");
      }
    });
  }
  ngOnInit(): void {
 /*   this._sse.getServerSentEvent('/api/test').subscribe(data=>{
      console.log(data);
    });*/

    this._sse.returnAsObservable().subscribe(data=>{
      console.log(data['msg']);

    });
    this._sse.getUpdates();
  }
  ngOnDestroy(): void {
    this._sse.stopUpdates();
    this.sub.unsubscribe();
  }
  openSnackBar(msg:string,val=2000,color='success-snackbar') {
    this.snackBar.open(msg,"OK", {
      duration: val,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [color]
    });
  }
  errsnackbar(msg:string,duration:number=10000,color:string='danger-snackbar'){
    //const duration = 60000;
    this.snackBarRef =this.snackBar.openFromComponent(CountdownSnackbarComponent, {duration,
      data: msg,
      panelClass: [color],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition});
    this.countdown.start(duration);
    this.snackBarRef.onAction().subscribe(() => {
      //this.retrysnack();
      this.snval*=2;
      this.val*=2;
      this.sub.unsubscribe();
      this.source = interval(this.val);
      this.checker(this.val-this.snval);
      this.sub=this.source.subscribe(next => {
        this.checker(this.val-this.snval);
      });
    });
  }
  infosnack(msg="Connecting...",act="OK"){
    this.snackBar.open(msg,act, {
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
  checker(val=10000):boolean{
      this._http.get("/api/state", { observe: 'response' })
      .pipe(first())
      .subscribe(resp => {
        if (resp.status === 200 ) {
          if(!this.test){
            //this.infosnack();
            this.openSnackBar("Online Mode");
            this.test=true;
            return true;
          }
          //console.log("true");
        } else {
          if (this.test)
          {
            this.infosnack();
            setTimeout(() =>
            {
              this.openSnackBar("Local Mode",val,'blue-snackbar');
            },
            2000);
          this.test=false;
          return false;
          //console.log("false")
          }
        }
      }, err => {
        //console.log(err);
        //if (this.test)
        this.infosnack();
        setTimeout(() =>
        {
          this.errsnackbar("Offline Mode",val);
        },
        2000);
        this.test=false;
      });
      return null;
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
