import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StateParameterService } from "../shared/st-parameter.service";
@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanActivate {

  constructor(private router: Router,private stService:StateParameterService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //const id = next.url[2].path;

    if (!this.stService.id) {
      alert('Please complete the form before uploading the photos!');
      this.router.navigate(['/form']);
      return false;
    }
    return true;
  }
}
