import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { StateParameterService } from "../shared/st-parameter.service";

import { IUser } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // If using Stackblitz, replace the url with this line
  // because Stackblitz can't find the api folder.
  // private userUrl = 'api/products/products.json';
  private userUrl = this.stService.host + "/api/getAll";

  constructor(private http: HttpClient,private stService:StateParameterService) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.userUrl)
      .pipe(
        tap(data => console.log('')),
        catchError(this.handleError)
      );
  }

  getUser(id: string): Observable<IUser | undefined> {
    return this.getUsers()
      .pipe(
        map((users: IUser[]) => users.find(p => p._id === id))
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
