import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StateParameterService } from "../shared/st-parameter.service";

/** we use this Form Guard to prohibit access to the next steps of the form if we don't have retrieved the citizen id */
@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanActivate {
  /**
   * Construct the FormGuard Injectable
   * @param router use Router service to navigate among views
   * @param stService use the fields in the bag to retreive the citizen id if it exists
   */
  constructor(private router: Router,private stService:StateParameterService) { }
  /**
   * Grant the access by returning true if the citizen id exists in the bag
   */
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.stService.id) {
      alert('Please complete the form before uploading the photos!');
      this.router.navigate(['/form']);
      return false;
    }
    return true;
  }
}
