/**
 * information about citizen
 */
export interface IUser {
      /** citizen id */

  _id: string;
      /** citizen first Name */

  firstName: string;
      /** citizen last Name*/

  lastName: string;
      /** citizen cin */

  cin: string;
      /** citizen adress */

  address: string;
      /** citizen gendre */

  sexe:string;
      /** citizen image */

  pic: string;
      /** citizen biometric image */

  bio:string;
}