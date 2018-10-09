import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {globalUrl} from "../backend/backend";
import {User} from "../user/user";

// Information about user that backend stores
export interface Group {
  id: number,
  name: string,
}
// Used for joining and creating new groups
export interface GroupAuth {
  groupName: string,
  groupPassword: string
}

/**
 * Service for getting group information from backend
 */
@Injectable()
export class GroupProvider {
  private addUrl = globalUrl + "/api/addGroup";
  private getGroupsUrl = globalUrl + "/api/getGroups";
  private switchGroupUrl = globalUrl + "/api/switchGroup/";
  private leaveGroupUrl = globalUrl + "/api/leaveGroup";
  private addMemberToGroupUrl = globalUrl + "/api/addMemberToGroup";

  constructor(public http: HttpClient) {
    console.log('Hello GroupProvider Provider');
  }

  addGroup(auth: GroupAuth) {
    return this.http.post<{result: string}>(this.addUrl, auth);
  }

  getGroups() {
    return this.http.get<Group[]>(this.getGroupsUrl);
  }

  switchGroup(name) {
    return this.http.get<{token: string, privilege: string}>(this.switchGroupUrl + name);
  }

  leaveGroup(auth: GroupAuth) {
    return this.http.post<{success: number}>(this.leaveGroupUrl, auth);
  }

  addMemberToGroup(emails: string) {
    let json = {
      email: emails
    }
    return this.http.post<User>(this.addMemberToGroupUrl, json);
  }
}
