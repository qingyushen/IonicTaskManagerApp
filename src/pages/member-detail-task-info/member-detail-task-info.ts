import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Task, TaskProvider} from "../../providers/task/task";
import {LanguageProvider} from "../../providers/language/language";
import {User, UserProvider} from "../../providers/user/user";

/**
 * Generated class for the MemberDetailTaskInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-detail-task-info',
  templateUrl: 'member-detail-task-info.html',
})
export class MemberDetailTaskInfoPage {

  loggedInUser: User;
  task: Task;
  aTask: string;
  TaskDetail: string;
  todo: Task;
  allTasks: Task[] = [];
  members: string[] =[];
  cancel: string = "Cancel";
  okay: string = "Okay";
  status:string;

  constructor(public navCtrl: NavController,public navParams: NavParams,
              public viewCtrl: ViewController,private taskProvider: TaskProvider, private translate: LanguageProvider,
              public userProvider: UserProvider) {
    this.task = this.navParams.get('bodyText');
    this.aTask = this.task.bodyText;
    this.userProvider.getUserById(localStorage.getItem('id')).subscribe((data: User) => {
      this.loggedInUser = data;
      console.log("logged in user:", this.loggedInUser);
    });
  }

  /**
   * Follow a prev unfollwed task after clicking the follow button. Modify its followedBy array and updatedAt variables
   * @param bodyText - The bodyText of task to be followed
   */
  follow(curTask: Task) {
    curTask.followedBy.push(this.loggedInUser);
    //curTask.updatedAt = new Date();
    let users: number[] = [];
    users.push(Number(localStorage.getItem('id')));
    this.taskProvider.addFollower(curTask.id.toString(), users).subscribe();
  }

  /**
   * Unfollow a prev followed task after clicking unfollow button. Modify followedBy and updatedAt variables
   * @param curTask - task to unfollow
   */
  unfollow(curTask: Task) {
    let usersFollowingCurTask = curTask.followedBy;
    let index = 0;
    for (index; index < usersFollowingCurTask.length; index++) {
      if (usersFollowingCurTask[index].id.toString() == localStorage.getItem('id')) {
        break;
      }
    }
    curTask.followedBy.splice(index, 1);
    //curTask.updatedAt = new Date();
    let users: number[] = [];
    users.push(Number(localStorage.getItem('id')));
    this.taskProvider.deleteFollower(curTask.id.toString(), users).subscribe();
  }

  findSame (task: User[]) {
    let result = false;
    if (task == null) {
      return false;
    }
    task.forEach( (temp: User) => {
      if (temp.id.toString() == localStorage.getItem('id')) {
        result = true;
      }});
    return result;
  }

  /**
   * Get the date string to print out below task bodytext. If task completed, print completedAt. Else print createdAt
   * @return - string
   */
  getDate() {
    if (this.task.done > 0) {
      this.status="Completed on";
      return  new Date(this.task.completedAt).toLocaleDateString();
    } else {
      this.status="Created on";
      return  new Date(this.task.createdAt).toLocaleDateString();
    }
  }

  /**
   * When user clicks on the confirm button. Update the task
   * @param updatedTask
   */
  confirm(updatedTask) {
    this.todo.done = 3;
    this.todo.bodyText = updatedTask;
    this.todo.updatedAt = new Date();
    this.taskProvider.updateTask(this.todo).subscribe();
    this.viewCtrl.dismiss(updatedTask);
    // this.navCtrl.pop()
  }

  ionViewWillEnter() {
    this.members = [];
    this.taskProvider.getFollows().subscribe((data: Task[]) => {
      this.allTasks = data;
      console.log(data)
      for(let t=0;t<=data.length;t++) {
        if (data[t] != undefined && data[t].bodyText == this.aTask) {
          this.todo = data[t];
        }
      }
    });
    this.members.push(localStorage.getItem('name'));
    for(let i=0; i<=this.allTasks.length; i++){
      if (this.allTasks[i]!=undefined) {
        this.members.push(this.allTasks[i].assignedToName);
      }
    }
    // console.log("all the members: "+this.members);
    // console.log("all the tasks"+ this.allTasks)
    this.TaskDetail = "Assigned by: "+ this.members[0] + " to ";
    for(let i =1;i<this.members.length;i++){
      this.TaskDetail=this.TaskDetail + this.members[i] + " ";
    }
    this.translate.getTranslate().use(this.translate.getLan());
    this.translate.getTranslate().get('input.cancel').subscribe(value => {
      this.cancel=value;
    });
    this.translate.getTranslate().get('input.okay').subscribe(value => {
      this.okay=value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowDetailPage');
  }
  dismiss(){
    this.viewCtrl.dismiss()
  }
}
