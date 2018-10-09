import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Task, TaskProvider} from "../../providers/task/task";
import {LanguageProvider} from "../../providers/language/language";
import {User, UserProvider} from "../../providers/user/user";

/**
 * Page navigated to when a task is clicked on the FollowedPage. Presents more information and details about a
 * specific task
 */
@IonicPage()
@Component({
  selector: 'page-followdetail',
  templateUrl: 'followdetail.html',
})
export class FollowDetailPage {
  visibility: string; // either 'public' or 'private' depending on task visibility
  editable: boolean = false; // This task is editable if authorID === loggedInUser's ID or user is admin
  task: Task;
  //todo: Task;
  cancel: string = "Cancel";
  okay: string = "Okay";
  author:string;
  assigned:string;
  allUsers: User[];
  loggedInUser: User; // current user who is logged in

  /**
   * ctor
   * @param navCtrl
   * @param navParams
   * @param alertCtrl
   * @param viewCtrl
   * @param taskProvider
   * @param translate
   * @param userProvider
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public viewCtrl: ViewController,private taskProvider: TaskProvider, private translate: LanguageProvider,
              private userProvider: UserProvider) {
    this.task = this.navParams.get('task');
    if(this.task.visible==1){
      this.visibility="Public";
    }
    else{
      this.visibility='Private';
    }
    this.editable = (this.task.authorID == localStorage.getItem('id')) ||
                    (localStorage.getItem('privilege') == 'admin') ? true : false;
    // if (!this.editable) {
    //   document.getElementById("taskBody").disabled = true;
    // }
    console.log(this.editable)
    this.author=this.task.authorName;
    this.assigned=this.task.assignedToName;
    this.userProvider.getUsers().subscribe(data => this.allUsers = data);
    this.userProvider.getUserById(localStorage.getItem('id')).subscribe( data => this.loggedInUser = data);
  }

  clear() {
    this.task.bodyText=''
  }

  /**
   * When user clicks on the confirm button. Update the task
   * @param updatedTask
   */
  confirm() {
    this.task.done = 3;
   // this.todo.bodyText = updatedTask;
    this.task.updatedAt = new Date();
    this.taskProvider.updateTask(this.task).subscribe();
    this.viewCtrl.dismiss(this.task);
    // this.navCtrl.pop()
  }

  /**
   * Getting the list of assignedTo users and handling what happens when you click on them. The values of each radio
   * button is the respective member's unique userID. All users in group are displayed
   */
  assignedToRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Assign this task to:");

    // Create a checkbox for every user
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].id.toString() == localStorage.getItem('id')) {
        continue;
      }
      // If the task was originally assigned to a user, change who you assign it to.
      if (this.allUsers[i].id == this.task.assignedToID) {
        alert.addInput({
          type: 'radio',
          label: this.allUsers[i].name,
          value: i.toString(),
          checked: true
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: this.allUsers[i].name,
          value: i.toString(),
          checked: false
        });
      }
    }

    alert.addButton(this.cancel);
    alert.addButton({
      text: this.okay,
      handler: (data: string) => {
        let index = parseInt(data, 10);
        this.task.assignedToID = this.allUsers[index].id;
        this.task.assignedToName = this.allUsers[index].name;
      }
    });
    alert.present();
  }

  visibilityRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Visibility');
    alert.addInput({
      type: 'radio',
      label: 'Public',
      value: 'Public',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Private',
      value: 'Private'
    } );

    alert.addButton(this.cancel);
    alert.addButton({
      text: this.okay,
      handler: data => {
        if(data=="Private"){
          this.task.visible = 0;
        }
        if(data=="Public"){
          this.task.visible = 1;
        }
        console.log('Radio data:', data,', visibility:',this.task.visible);
        this.visibility = data;
      }
    });
    alert.present().then(() => {
    });
  }

  ionViewWillEnter() {
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

  /**
   * Follow a prev unfollwed task after clicking the follow button. Modify its followedBy array and updatedAt variables
   */
  follow() {
    this.task.followedBy.push(this.loggedInUser);
    //curTask.updatedAt = new Date();
    let users: number[] = [];
    users.push(Number(localStorage.getItem('id')));
    this.taskProvider.addFollower(this.task.id.toString(), users).subscribe();
  }

  /**
   * Unfollow a prev followed task after clicking unfollow button. Modify followedBy and updatedAt variables
   */
  unfollow() {
    let usersFollowingCurTask = this.task.followedBy;
    let index = 0;
    for (index; index < usersFollowingCurTask.length; index++) {
      if (usersFollowingCurTask[index].id.toString() == localStorage.getItem('id')) {
        break;
      }
    }
    this.task.followedBy.splice(index, 1);
    //curTask.updatedAt = new Date();
    let users: number[] = [];
    users.push(Number(localStorage.getItem('id')));
    this.taskProvider.deleteFollower(this.task.id.toString(), users).subscribe();
  }

  /**
   * Check if the array of users includes the current memberBeingViewed
   * @param users
   */
  findSame (users: User[]) {
    let result = false;
    if (users == null) {
      return false;
    }
    users.forEach( (temp: User) => {
      if (temp.id.toString() == localStorage.getItem('id')) {
        result = true;
      }});
    return result;
  }
}
