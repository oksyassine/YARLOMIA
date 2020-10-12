import { Injectable, EventEmitter } from '@angular/core';
/**
 * Bag to store the fields that we need in our application
 */
@Injectable({
  providedIn: 'root'
})
export class StateParameterService {
  /** Id of the citizen */
  id: string;
  /** It can takes URL of the remote server or the local one */
  host:string;
  /** The form filled in by the user */
  form:JSON;
  /** Portrait picture of the citizen */
  pic:File;
  /** The event emitter that we use to lock the switching from the 2 modes (online and local) inside a form */
  busy: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

}
