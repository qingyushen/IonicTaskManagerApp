import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User, UserProvider} from "../user/user";
import {globalUrl} from "../backend/backend";
// import { Observable } from 'rxjs/Observable';
// import * as jwt from 'jsonwebtoken';

export interface RegisterInfo {
  name: string,
  email: string,
  password: string,
  groupName: string,
  groupPassword: string,
}

@Injectable()
export class AuthProvider {
  private loginUrl = globalUrl + '/auth/login';
  private registerUrl = globalUrl + '/auth/addUser';
  constructor(public http: HttpClient, public userProvider: UserProvider) {
    console.log('Hello AuthProvider Provider');
  }

  /*
  Login and set the local storage if valid username and password
   */
  public login(user: User) {
    return this.http.post<any>(this.loginUrl, user);
  }

  /**
   * Create a new account
   */
  public register(newUser: RegisterInfo) {
    return this.http.post<User>(this.registerUrl, newUser)
  }

  /*
  Auth token to verify auto-login and access to specific user information
   */
  public getToken(): string {
    return localStorage.getItem('currentUser'); // Gets the JWT
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
