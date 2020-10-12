import {BehaviorSubject} from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Event Service helps us to get the Server Sent Events from our remote or local server
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  /** URL of the remote server */
  static server="http://localhost:3000";
  /** URL of the local server */
  static local="http://localhost:3003";
  constructor() {}
  /**
   * Event Source Object
   */
  evs: EventSource;
  /**
   * Type used to know which data type emitted to the component.
   */
  type="";
  /**
   * BehaviorSubject Used to emit data to other components
   */
  private subj = new BehaviorSubject(this.type);
  /**
   * An observable so we can subscribe for the events emitted from this class.
   */
  returnAsObservable() {
      return this.subj.asObservable();
  }
  /**
   * Start Listening from the event source in our local server, emitting events to the component and handling errors.
   */
  getUpdates(host=EventService.server) {
      let subject = this.subj;
      /**
       * Local Variable used to know which state where we are:
       *
       * Initial State =-1
       */
      let k=-1;
      if (typeof(EventSource) !== 'undefined') {
          this.evs = new EventSource(host+'/api/state');
          this.evs.onopen = function(e) {
              console.log("Opening connection with " + host);
          }
          this.evs.addEventListener("dbx", function(e) {
            if (k==-1 || k==0)
              subject.next(e["data"]+'x');
            k=0;
          });
          this.evs.addEventListener("db", function(e) {
            if (k==-1 || k==0)
              subject.next(e["data"]);
            k=0;
          });
          this.evs.onerror = function(e) {
            if (k==-1){
              if (host==EventService.server)
                subject.next('ex');
              else subject.next('e');
            }
            if(k==2){
              if(host==EventService.server)
                subject.next("rx");
              else subject.next("r");
            }
            if (this.readyState == 0) {
              console.log("Reconnecting… "+host);
              k++;
            }
          }
      }
  }
  /**
   * This function Stops the communication between the app and the event source
   */
  stopUpdates() {
    if(this.evs.url==EventService.server+"/api/state"){
      return null;
    }
    console.log("Closing connection with " + this.evs.url);
      this.evs.close();
  }
}
