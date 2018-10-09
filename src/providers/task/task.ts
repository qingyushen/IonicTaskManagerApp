import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {globalUrl} from "../backend/backend";
import {User} from "../user/user";

export interface Task {
  id: number,
  authorName:string,
  authorID: string,
  assignedToID: number,
  assignedToName:string,
  bodyText: string,
  dateTime: Date,
  dueDate: string,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,     // Analysis
  completedDay: number, // Analysis
  done: number,
  visible: number,
  groupName: string,
  followed:number,
  followedBy: User[],
}


export interface Updates {
  author: string,
  content: string,
  icon: string,
  time: {title:string,subtitle:string}
}

/*
  Service class for tasks
*/
@Injectable()
export class TaskProvider {

  private url = globalUrl + "/api/getTasks"; // obtain all tasks
  private saveTaskURL = globalUrl + "/api/addTask"; // save a task
 // private updateURL = globalUrl + "/api/updateTask"; // update a Task already in database
  private deleteURL = globalUrl + "/api/deleteTask";
  private teamUpdatesURL = globalUrl + "/api/getTeamUpdates";
  private userTasksURL = globalUrl + "/api/getUserTasks";
  private emailDocURL = globalUrl + "/api/emailDoc";
  private saveTasksURL=globalUrl+"/api/addTasks";// save an array of tasks
  private getFollowsURL=globalUrl+"/api/getFollowedTasks"; // Deprecated
  private addFollowingURL = globalUrl + "/api/addFollowing/";
  private deleteFollowingURL = globalUrl + "/api/deleteFollowing/";

  // More FollowPage URLS
  private getFollowedOthersCompletedUrl = globalUrl + "/api/getFollowedOthersComplete";
  private getFollowedOthersTodoUrl = globalUrl + "/api/getFollowedOthersTodo";
  private getFollowedSelfCompletedUrl = globalUrl + "/api/getFollowedSelfComplete";
  private getFollowedSelfTodoUrl = globalUrl + "/api/getFollowedSelfTodo";

  // More TaskPage URLS
  private getTasksTodoPublicUrl = globalUrl + "/api/getTasksTodoPublic";
  private getTasksTodoPrivateUrl = globalUrl + "/api/getTasksTodoPrivate";
  private getTasksCompletedPublicUrl = globalUrl + "/api/getTasksCompletedPublic";
  private getTasksCompletedPrivateUrl = globalUrl + "/api/getTasksCompletedPrivate";
  private deleteCompletedTasksUrl = globalUrl + "/api/deleteCompletedTasks";

  constructor(public http: HttpClient) {
    console.log('Hello TaskProvider Provider');
  }

  public deleteCompletedTasks() {
    return this.http.get<{result: string}>(this.deleteCompletedTasksUrl);
  }

  public getTasksTodoPublic() {
    return this.http.get<Task[]>(this.getTasksTodoPublicUrl);
  }

  public getTasksTodoPrivate() {
    return this.http.get<Task[]>(this.getTasksTodoPrivateUrl);
  }

  public getTasksCompletedPublic() {
    return this.http.get<Task[]>(this.getTasksCompletedPublicUrl);
  }

  public getTasksCompletedPrivate() {
    return this.http.get<Task[]>(this.getTasksCompletedPrivateUrl);
  }

  /**
   * Get followed, completed tasks in same group assigned to others
   */
  public getFollowedOthersCompleted() {
    return this.http.get<Task[]>(this.getFollowedOthersCompletedUrl);
  }

  /**
   * Get followed, uncompleted tasks in same group assigned to others
   */
  public getFollowedOthersTodo() {
    return this.http.get<Task[]>(this.getFollowedOthersTodoUrl);
  }

  /**
   * Get followed, completed tasks in same group assigned to self
   */
  public getFollowedSelfCompleted() {
    return this.http.get<Task[]>(this.getFollowedSelfCompletedUrl);
  }

  /**
   * Get followed, uncompleted tasks in same group assigned to self
   */
  public getFollowedSelfTodo() {
    return this.http.get<Task[]>(this.getFollowedSelfTodoUrl);
  }

  /**
   * Add an array of new users to follow a task.
   * @param taskID - The id of task to be followed
   * @param users - The id of users in an array to follow task
   */
  public addFollower(taskID: string, users: number[]) {
    return this.http.post<Task>(this.addFollowingURL + taskID, users);
  }

  public deleteFollower(taskID: string, users: number[]) {
    return this.http.post<Task>(this.deleteFollowingURL + taskID, users);
  }


  public getTasks() {
    return this.http.get<Task[]>(this.url)
      // .pipe(
      //   retry(3)
      // );
  }

  public emailDoc() {
    return this.http.get(this.emailDocURL);
  }

  public saveTask(task: Task) {
    return this.http.post<Task>(this.saveTaskURL, task);
  }

  public saveTasks(tasks:Task[]){
    return this.http.post<Task[]>(this.saveTasksURL,tasks)
}
  /**
   * Get the latest 30 dates that have been updated
   */
  public getTeamUpdates() {
    return this.http.get<Task[]>(this.teamUpdatesURL);
  }

  public getFollows() {
    return this.http.get<Task[]>(this.getFollowsURL);

  }
  /**
   * Get the tasks for a specified user
   * @param email - The unique email of the specified user
   */
  public getUserTasks(id: number) {
    return this.http.get<Task[] >(this.userTasksURL + '/' + id);
  }
  
  /*
   * Update the task on the server
   */
  public updateTask(task: Task) {
    return this.http.post<Task>(this.saveTaskURL, task);
  }

  /**
   * Delete task on server
   */
  public deleteTask(id): Observable<{}> {
    const url = `${this.deleteURL}/${id}`;
    return this.http.get(url);
  }

}
