import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * we use this Guard to prohibit access to the citizen id
 */
@Injectable({
  providedIn: 'root'
})
export class UserDetailGuard implements CanActivate {
 /** use Router service to navigate among views  */
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = next.url[1].path;
    /** Grant the access by returning true if the citizen id exists in the bag*/

    if (!id) {
      alert('Invalid citizen Id');
      this.router.navigate(['/users']);
      return false;
    }
    return true;
  }
}