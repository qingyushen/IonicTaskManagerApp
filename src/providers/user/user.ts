import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';


import {globalUrl} from "../backend/backend";
import {Task} from "../task/task";

// Information about user that backend stores
export interface User {
  profileImgUrl: string,
  coverImgUrl: string,
  id: number,
  name: string,
  email: string,
  password: string,
  privilege: string,
  team: string,
  language: string,
  tasksCompleted: number, // Analysis
  completeTime: number, // Analysis
  avgTime: number, // Analysis
}
export interface members {
  User:User,
  Tasks:Task[]
}
export interface userEmail {
  email:string
}
export  interface newPwd {
  email:string,
  password:string,
  token:string
}

// Format for current user
// interface curUser {
//   id: number,
//   name: string,
//   email: string,
//   privilege: string,
//   curTeam: string
// }

@Injectable()
export class UserProvider {

  private url = globalUrl + "/api/getUsers";
  private getByIdUrl=globalUrl+"/api/getUserById/";
  private resetAnalyticsUrl = globalUrl + "/analysis/resetAnalytics";
  private profileImgUrl = globalUrl + "/api/changeProfileImg";
  private coverImgUrl = globalUrl + "/api/changeCoverImg";
  private makeAdminUrl = globalUrl + "/api/makeUserAdmin/";
  private checkUserAdminUrl = globalUrl + "/api/checkUserAdmin/";
  private changeLanguageUrl = globalUrl + "/settings/changeLang/";
  private getLanguageUrl = globalUrl + "/settings/getLang";
  private makeMemberUrl = globalUrl + "/api/makeUserMember/";
  private forgetPwdUrl=globalUrl+"/auth/forgotPassword/";
  private authenTokenUrl=globalUrl+"/auth/forgotPasswordToken/";
  private updatePwdUrl=globalUrl+"/auth/forgotPasswordChange/";
  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  getLanguage() {
    return this.http.get<{language: string}>(this.getLanguageUrl);
  }


  changeLanguage(lang: string) {
    return this.http.get<{success: number}>(this.changeLanguageUrl + lang);
  }

  changeProfileImg(newImg: string) {
    return this.http.post<{result: string}>(this.profileImgUrl, {url: newImg});
  }

  changeCoverImg(newImg: string) {
    return this.http.post<{result: string}>(this.coverImgUrl  , {url: newImg});
  }
  changePwd(userEmail: userEmail){
    return this.http.post<{result: string}>(this.forgetPwdUrl,userEmail)
  }
  authenPwd(token:string){
    return this.http.get<{result:string}>(this.authenTokenUrl + token);
  }
  updatePwd(newPwd:newPwd){
    return this.http.post<{result:number}>(this.updatePwdUrl,newPwd);
  }
  makeUserAdmin(userId: number) {
    return this.http.get<{result: string}>(this.makeAdminUrl + userId.toString());
  }

  makeUserMember(userId: number) {
    return this.http.get<{result: string}>(this.makeMemberUrl + userId.toString());
  }

  checkUserAdmin(userId: number) {
    return this.http.get<{result: string}>(this.checkUserAdminUrl + userId.toString());
  }

  /*
   * This is the GET method used for retrieving users in current group
   */
  getUsers() {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: string) {
    return this.http.get<User>(this.getByIdUrl + id);
  }


  /**
   * Reset the analytic columns of the user object
   */
  resetAnalytics() {
    return this.http.get<User[]>(this.resetAnalyticsUrl);
  }


  /*
   * This is an experimentation GET method. It extends from getUsers() by
   * returning the full response instead of just JSON.
  //  */
  // getUserResponse(): Observable<HttpResponse<User[]>> {
  //   return this.http.get<User[]>(
  //     this.url, { observe: 'response' });
  // }
  // getUserResponse(): Observable<HttpResponse<User[]>> {
  //   return this.http.get<User[]>(
  //     this.url, { observe: 'response' });
  // }
  //
  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  // };
}
