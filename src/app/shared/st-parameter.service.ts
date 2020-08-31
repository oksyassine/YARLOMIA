import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateParameterService {
  id: string;
  host:string;
  form:JSON;
  pic:File;
  busy: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

}
