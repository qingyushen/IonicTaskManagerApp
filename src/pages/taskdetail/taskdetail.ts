import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Task} from "../../providers/task/task";
import {TaskProvider} from "../../providers/task/task"
import {LanguageProvider} from "../../providers/language/language"
import {User, UserProvider} from "../../providers/user/user";

/**
 * Navigation: Click on a task in the TaskPage
 * Usage: Provides more detailed information about a specific task
 */
@IonicPage()
@Component({
  selector: 'page-taskdetail',
  templateUrl: 'taskdetail.html',
})
export class TaskdetailPage {
  visibility: string; // either 'public' or 'private' depending on task visibility. Used on taskDetail.html line 34.
  task: Task; // The task being viewed
  cancel: string = "Cancel";
  okay:string = "Okay";
  allUsers: User[]; // All the members in the current team
  loggedInUser: User; // current user who is logged in
  editable: boolean;
  assignTitle:string;
  labelPublic:string;
  labelPrivate:string;
  alertTitle:string;

  /**
   * Get the current task being viewed from NavParams and set allUsers
   * @param navCtrl
   * @param alertCtrl
   * @param navParams - contains 'item' which is task being viewed
   * @param viewCtrl
   * @param taskProvider
   * @param translate
   */
  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public navParams: NavParams,
              public viewCtrl: ViewController,private taskProvider: TaskProvider, private translate: LanguageProvider,
              public userProvider: UserProvider) {
    console.log("ctor")
    this.task=this.navParams.get('item');
    this.userProvider.getUsers().subscribe( (data) => {this.allUsers = data});

    this.userProvider.getUserById(localStorage.getItem('id')).subscribe( data => {
      console.log("gettinguserby id")
      this.loggedInUser = data;
      console.log(data);
    });

    this.editable = (this.task.authorID == localStorage.getItem('id')) ||
    (localStorage.getItem('privilege') == 'admin') ? true : false;
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

  /**
   * onClick button effect for clearing the bodyText content of a task.
   */
  clear(){
    this.task.bodyText=''
  }

  /**
   * onClick button effect for navigating back to parent page after confirming changes.
   * @param newtask - updated task.bodyText
   */
  confirm(newtask: string){
    console.log(newtask);
    this.task.updatedAt=new Date();
    this.task.done = 0;
    this.taskProvider.updateTask(this.task).subscribe();
    this.viewCtrl.dismiss(newtask);
    // this.navCtrl.pop()
  }

  setPriv(){
    this.task.visible=0;
    console.log("changed status to private");
    console.log("visibility changed to: "+this.task.visible)
  }
  setPub(){
    this.task.visible=1;
    this.task.done=2;
    this.task.updatedAt=new Date();
    console.log("changed status to private")
    console.log("visibility changed to: "+this.task.visible)
  }

  visibilityRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.alertTitle);
    alert.addInput({
      type: 'radio',
      label: this.labelPublic,
      value: 'Public',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: this.labelPrivate,
      value: 'Private'
    } );

    alert.addButton(this.cancel);
    alert.addButton({
      text: this.okay,
      handler: data => {
        if(data=="Private"){
          this.setPriv()
        }
        if(data=="Public"){
          this.setPub()
        }
        console.log('Radio data:', data,', visibility:',this.task.visible);
        this.visibility = data;
      }
    });
    alert.present().then(() => {
    });
  }

  /**
   * Getting the list of assignedTo users and handling what happens when you click on them. The values of each radio
   * button is the respective member's unique userID. All users in group are displayed
   */
  assignedToRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.assignTitle);

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

  /**
   * Translation prior to entering page
   */
  ionViewWillEnter(){
    console.log("ionViewWillEnter taskDetail");
    this.translate.getTranslate().use(this.translate.getLan());
    this.translate.getTranslate().get('input.cancel').subscribe(value => {
      this.cancel=value
    });
    this.translate.getTranslate().get('input.okay').subscribe(value => {
      this.okay=value
    });
    this.translate.getTranslate().get('input.title').subscribe(value => {
      this.assignTitle=value
    });
    if(this.task.visible==1){
      this.visibility="Public";
    this.translate.getTranslate().get('Task.public').subscribe((value => {
      this.labelPublic=value;
    }));
    this.translate.getTranslate().get('Task.private').subscribe((value => {
      this.labelPrivate=value;
    }));
    this.translate.getTranslate().get('input.visibility').subscribe(value => {
      this.alertTitle=value
    });
    }
    else{
      this.visibility='Private';
    }
  }

  /**
   * Debugging
   */
  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskdetailPage');
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }


}
