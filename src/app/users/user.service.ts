import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { StateParameterService } from "../shared/st-parameter.service";

import { IUser } from './user';
import { Router } from '@angular/router';
/**getUsersService Injectable */

@Injectable({
  providedIn: 'root'
})
export class UserService {
/**Construct the component  */
  constructor(private router : Router,private http: HttpClient,private stService:StateParameterService) { }
  /** This function is triggered to get all citizens */

  getUsers(): Observable<IUser[]> {
    if(!this.stService.host)
    this.router.navigate(["/"]);
    return this.http.get<IUser[]>(this.stService.host + "/api/getAll")
      .pipe(
        tap(data => console.log('')),
        catchError(this.handleError)
      );
  }
  /** This function is triggered to get citizen by id*/

  getUser(id: string): Observable<IUser | undefined> {
    return this.getUsers()
      .pipe(
        map((users: IUser[]) => users.find(p => p._id === id))
      );
  }
  /** This function is triggered when the functions getUser and getUsers have a error*/

  private handleError(err: HttpErrorResponse): Observable<never> {
   
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
   
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}