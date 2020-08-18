import { Component } from '@angular/core';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'pm-root',
  template: `
    <mat-toolbar color="primary">
    <nav class='navbar navbar-expand navbar-dark'>
        <span style="color:white;" class='navbar-brand' routerLinkActive='active' [routerLink]="['/']">{{pageTitle}}</span>
        <ul class=' navbar-nav nav-pills'>
          <li class="nav-item"><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/home']">Home</a></li>
          <li class="nav-item"><a class='nav-link' style="color:white;" routerLinkActive='active' [routerLink]="['/users']">Users</a></li>
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
export class AppComponent  {
  pageTitle = 'YARLOMIA';
  //status = ': ONLINE';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private _snackBar: MatSnackBar) {
    this.createOnline$().subscribe(isOnline => {
      if(isOnline){
        //this.status=': ONLINE';
        this.openSnackBar("Online Mode");
      }else{
        //this.status=': OFFLINE';
        this.openSnackBar("Offline Mode");
      }
    });
  }
  openSnackBar(msg:string) {
    this._snackBar.open(msg, 'OK', {
      duration: 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
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
}
