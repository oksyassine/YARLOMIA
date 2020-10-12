import { Component, Inject, OnDestroy, OnInit, Injectable } from '@angular/core';
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

/**
 * Service for cross component communication. */
@Injectable()
export class CountdownService {
  startTimer = new Subject < number > ();
  timer = this.startTimer.pipe(switchMap(seconds =>
    timer(0, 1000).pipe(map(t => seconds - t), take(seconds + 1))
  ));
  /**
   * Start the Countdown
   * @param time Number of milliseconds
   */
  start(time: number) {
    const seconds = Math.floor(time / 1000);
    this.startTimer.next(seconds);
  }
  /**
   * Return the time left to print it out in the snackbar
   */
  timeLeft(): Observable < number > {
    return this.timer;
  }
}
/**
 * Main Page at /
 */
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
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Title of The page
   */
  pageTitle = 'YARLOMIA';
  /**
   * Value of milliseconds to initiate the interval
   */
  val = 12000;
  /**
   * Value of milliseconds of the difference between the end of the duration of waiting
   *  and the connecting snackbar
   */
  snval = 2000;
  /**
   * Creates an Observable that emits sequential numbers every specified interval of time
   */
  private source = interval(this.val);
  /**
   * Creates a subscription field so we can attach it to the execution of the observable of the server sent events
   * and we can unsubscribe from it when we want or at the end of the component
   */
  private sub: Subscription;
  /**
   * Creates a subscription field so we can attach it to the execution of the observable of the interval observable
   * that we have defined previously and we can unsubscribe from it when we want or at the end of the component
   */
  private check: Subscription;
  /**
   * Test if we are in offline mode or not
   */
  test: boolean;
  /**
   * Old string received if we are in online mode
   */
  old: string;
  /**
   * Old string received if we are in local mode
   */
  oldloc: string;
  /**
   * Reference to a snack bar in the component "CountdownSnackbarComponent"
   */
  snackBarRef: MatSnackBarRef < CountdownSnackbarComponent > ;
  /**
   * Define a default Horizontal Position of the snackbar
   */
  horizontalPosition: MatSnackBarHorizontalPosition = 'left';
  /**
   * Define a default Vertical Position of the snackbar
   */
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  /**
   * Subscribe for the events emitted by the browser about the internet connectivity
   * and subscribe for the observable returned by the interval function if the browser is connected
   * @param _http Http Client
   * @param stService Instance of the StateParameterService Class
   * @param UpService Instance of the FileUploadService Class
   * @param snackBar Snackbar instance to open a new snackbar
   * @param countdown Instance of the CountdownService Class
   * @param _sse Instance of the EventService Class for the online mode
   * @param loc Instance of the EventService Class for the local mode
   */
  constructor(private _http: HttpClient, private stService: StateParameterService, private UpService: FileUploadService,
    private snackBar: MatSnackBar, private countdown: CountdownService, private _sse: EventService, private loc: EventService) {
    this.createOnline$().subscribe(isOnline => {
      if (isOnline) {
        this._sse.getUpdates();
        this.val = 12000;
        this.test = false;

        this.check = this.source.subscribe(next => {
          if (this.test) {
            this.checker();
            console.log("access interval");
          }
        });
      } else {
        //this.sub.unsubscribe();
        this._sse.evs.close();
        this.old = "";
        this.oldloc = "";
        if (this.check)
          this.check.unsubscribe();
        this.openSnackBar("Device Disconnected", 'danger-snackbar');
      }
    });
  }
  /**
   * Subscribe for the events sent by the event source "busy", and subscribe for the events sent
   * from the Server-sent events "_sse"
   */
  ngOnInit(): void {
    var busy: boolean;
    this.stService.busy.subscribe(foo => {
      if (!foo && this.old == 'yx') {
        busy = false;
        this.openSnackBar("Online Mode");
        this.stService.host = EventService.server;
        this.loc.stopUpdates();
        this.test = false;
        console.log("Access: busy");
        this.oldloc = "";
      } else busy = true;
    });
    this.sub = this._sse.returnAsObservable().subscribe(msg => {
      console.log(msg);
      if (msg == 'yx' && !busy) {
        this.openSnackBar("Online Mode");
        this.stService.host = EventService.server;
        this.loc.stopUpdates();
        this.test = false;
        this.old = msg;
        this.oldloc = "";
        console.log("Access: " + msg);
      }else if ((msg == "rx" || msg == 'nx') ) {
        this.loc.getUpdates(EventService.local);
        this.old = msg;
        console.log("Access: " + msg);
      } else if (msg == 'y' && msg != this.oldloc) {
        this.stService.host = EventService.local;
        this.openSnackBar("Local Mode", 'blue-snackbar');
        this.restore();
        this.test = false;
        this.oldloc = msg;
        this.old = "";
        console.log("Access: " + msg);
      } else if ((msg == 'r' || msg == 'n' || msg == 'e') && msg != this.oldloc) {
        this.stService.host = "";
        this.loc.stopUpdates();
        this.test = true;
        this.oldloc = msg;
        this.old = "";
        console.log("Access: " + msg);
      }else if (msg == 'ex') {
        if(!this.test)
          this.loc.getUpdates(EventService.local);
        setTimeout(() => {
            this.loc.stopUpdates();
            this._sse.getUpdates();
          },
          10000);
          console.log("Access: "+msg);
        this.old = msg;
      }
      if (msg == 'yx')
        this.old = msg;
    });
  }
  /**
   * Unsubsribe from all subscriptions in the component and stops the communication with the event sources
   */
  ngOnDestroy(): void {
    this._sse.stopUpdates();
    this.loc.stopUpdates();
    this.sub.unsubscribe();
    this.check.unsubscribe();
  }
  /**
   * restore the incomplete form to the local server if the connection to the remote one is lost
   */
  restore(): void {
    if (this.stService.form)
      this._http.post(this.stService.host + '/api/form', this.stService.form).subscribe(data => {
        setTimeout(() => {
            this.openSnackBar("Personal Informations Saved", 'blue-snackbar', 3000);
          },
          3000);
      });
    if (this.stService.pic) {
      this.UpService.postImg(this.stService.pic, this.stService.id, this.stService.host, "pic").subscribe(
        (event: any) => {
          setTimeout(() => {
              this.openSnackBar("Portrait Uploaded Successfully!", 'blue-snackbar', 3000);
            },
            6000);
        });
    }
  }
  /**
   * Opens a snackbar
   * @param msg Message To show
   * @param color Background color of the snackbar
   * @param val Timeout value before the snackbar disappear automatically
   */
  openSnackBar(msg: string, color = 'success-snackbar', val = 10000) {
    this.snackBar.open(msg, "OK", {
      duration: val,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [color]
    });
  }
  /**
   * Opens a custom snackbar from the "CountdownSnackbarComponent" Component
   * @param msg Message To show
   * @param duration Timeout value before the snackbar disappear automatically
   * @param color Background color of the snackbar
   */
  errsnackbar(msg: string, duration: number = 10000, color: string = 'danger-snackbar') {
    if (this.snackBarRef)
      this.snackBarRef.dismiss();
    this.snackBarRef = this.snackBar.openFromComponent(CountdownSnackbarComponent, {
      duration,
      data: msg,
      panelClass: [color],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
    this.countdown.start(duration);
    this.snackBarRef.onAction().subscribe(() => {
      this.snval *= 2;
      this.val *= 2;
      this.check.unsubscribe();
      this.source = interval(this.val);
      this.checker(this.val - this.snval);
      this.check = this.source.subscribe(next => {
        this.checker(this.val - this.snval);
      });
    });
  }

/**
 * Returns The state of the connectivity using the browser
 */
  createOnline$() {
    return merge < boolean > (
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer < boolean > ) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
  /**
   * Check the status of the local server
   * @param val Duration of the offline mode snackbar before retrying
   */
  checker(val = 10000): void {
    this._http.get(EventService.local+"/api/db", {
        observe: 'response'
      })
      .pipe(first())
      .subscribe(resp => {
        if (resp.status === 200) {
          if (this.test) {
            this.loc.getUpdates(EventService.local);
            console.log("back to local mode");
          }
        }
      }, err => {
        console.log("still offline mode");
        this.openSnackBar("Connecting...",'blue-snackbar',1000);
        setTimeout(() => {
            this.errsnackbar("Offline Mode", val);
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
  /**
   * Time left returned from the CountdownService
   */
  timeLeft$ = this.countdown.timeLeft();
  /**
   * Constructor of the CountdownSnackbarComponent
   * @param countdown Instance from CountdownService Injectable
   * @param data The message to show in the snackbar
   * @param snackBarRef Reference to the snackbar
   */
  constructor(private countdown: CountdownService, @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef < CountdownSnackbarComponent > ) {}
}
