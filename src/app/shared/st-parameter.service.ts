import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateParameterService {
  id: string;
  host:string;
  form:JSON;
  pic:File;

  constructor() { }

}
