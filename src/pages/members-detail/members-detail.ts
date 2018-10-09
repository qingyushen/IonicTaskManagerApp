import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {User, UserProvider} from "../../providers/user/user";
import {ScrollHideConfig} from '../scroll-hide';
import {Task, TaskProvider} from "../../providers/task/task";
import {LanguageProvider} from "../../providers/language/language";
import {MemberDetailTaskInfoPage} from "../member-detail-task-info/member-detail-task-info";
import {Group, GroupAuth} from "../../providers/group/group";

/**
 * Navigated to from MembersPage. Lists the current and completed tasks of a specified member/user.
 */
@IonicPage()
@Component({
  selector: 'page-members-detail',
  templateUrl: 'members-detail.html',
})
export class MembersDetailPage {
  memberBeingViewed: User; // the user whose details are being viewed
  memberIsAdmin: boolean; // whether the member is admin or not of current group

  loggedInUser: User; // the user who is logged in and currently using the app
  loggedInUserIsAdmin: boolean;

  headerScrollConfig: ScrollHideConfig = {cssProperty: 'margin-top', maxValue: 44};

  // Tasks
  allTasksOfMember: Task[] = []; // all the tasks of memberBeingViewed
  todoTasksOfMember: Task[] = []; // The todo tasks of allTasksOfMember
  completedTasksOfMember: Task[] = []; // The completed tasks of allTasksOfMember

  /**
   * 1. Sets the memberBeingViewed and logged in user variables
   * 2. Do translation depending on selected language
   * 3. Initialize allTasksOfMember,
   * @param navCtrl - navigation
   * @param userProvider
   * @param navParams - contains 'user' which sets memberBeingViewed variable
   * @param taskProvider -
   * @param translate - translation
   * @param viewCtrl
   */
  constructor(public navCtrl: NavController, public userProvider: UserProvider, public navParams: NavParams,
              public taskProvider: TaskProvider, public translate: LanguageProvider, public viewCtrl: ViewController,
              public modalCtrl: ModalController, private alertCtrl: AlertController) {

    // 1.
    this.memberBeingViewed = this.navParams.get('user');
    this.userProvider.getUserById(localStorage.getItem('id')).subscribe((data: User) => {
      this.loggedInUser = data;
      console.log("logged in user:", this.loggedInUser);
    });

    // 2.
    this.translate.getTranslate().use(this.translate.getLan());

    // 3.
    this.taskProvider.getUserTasks(this.memberBeingViewed.id).subscribe((data: Task[]) => {
      console.log(data);
      this.allTasksOfMember = data;
      for (let i = 0; i <= data.length; i++) {
        if (data[i] == undefined || data[i].visible == 0) {
          continue;
        }
        else if (data[i].done == 1) {
          this.completedTasksOfMember.push(data[i]);
        }
        else {
          this.todoTasksOfMember.push(data[i]);
        }
      }
      //console.log("t.followedBy.indexOf(loggedInUser) == -1: ", this.todoTasksOfMember[1].followedBy.indexOf(this.loggedInUser) == -1);
    });

    // 4.
    this.userProvider.checkUserAdmin(this.memberBeingViewed.id).subscribe( data => {
      console.log("memberBeingViewed is: " + data.result);
      if (data.result == "admin") {
        this.memberIsAdmin = true;
        console.log(this.memberIsAdmin);
      } else {
        this.memberIsAdmin = false;
        console.log(this.memberIsAdmin);
      }
    });

    if (localStorage.getItem('privilege') == 'admin') {
      this.loggedInUserIsAdmin = true;
    } else {
      this.loggedInUserIsAdmin = false;
    }
  }

  openItem(item: Task) {
    let modal = this.modalCtrl.create(MemberDetailTaskInfoPage, {
      "bodyText": item,
    });
    modal.onDidDismiss(data => {
      // todo
    });
    modal.present()
  }

  /**
   * Convert memberBeingViewed privilege from 'member' to 'admin'
   */
  makeUserAdmin() {
    this.userProvider.makeUserAdmin(this.memberBeingViewed.id).subscribe(data => {
      if (data.result == "success") {
        console.log("successfully added admin")
        this.memberIsAdmin = true;
      } else if (data.result == "non-admin access") {
        console.log("non admin privileges")
      }
    });
  }

  /**
   * Shows an alert when user calls makeUserMember() but there is only 1 admin left in group. There must be at least
   * 1 admin so show an error alert.
   */
  show1AdminAlert() {
    let alert = this.alertCtrl.create({
      title: "Denied",
      message: "There must be at least 1 admin in a group",
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Convert the memberBeingViewed from 'admin' to 'member' privilege
   */
  makeUserMember() {
    this.userProvider.makeUserMember(this.memberBeingViewed.id).subscribe(data => {
      if (data.result == "success") {
        console.log("successfully added admin")
        this.memberIsAdmin = false;
      } else if (data.result == "non-admin access") {
        console.log("non admin privileges")
      } else if (data.result == "1admin") {
        this.show1AdminAlert();
      }
    });
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
    if (temp.id == this.loggedInUser.id) {
      result = true;
    }});
    return result;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersDetailPage');
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }
}
