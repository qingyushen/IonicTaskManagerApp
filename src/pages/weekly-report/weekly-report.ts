import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {LanguageProvider} from "../../providers/language/language";
import {TaskProvider,Task} from "../../providers/task/task";
import {User, UserProvider,members} from "../../providers/user/user";
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import {globalUrl} from "../../providers/backend/backend";
import {MemberDetailTaskInfoPage} from "../member-detail-task-info/member-detail-task-info";
import {HttpClient} from "@angular/common/http";
// import { DeviceDetectorService } from 'ngx-device-detector';
import {FileOpener} from "@ionic-native/file-opener";

/**
 * Navigation: Weekly report page navigated from OverviewPage
 */
@IonicPage()
@Component({
  selector: 'page-progress',
  templateUrl: 'weekly-report.html',
})
export class WeeklyReportPage {
  users:User[]=[];
  members:members[]=[];
  loggedInUser: User;
  url: string=globalUrl +'/FileTransfer/download/iPlat4C-Weekly.docx';

//private deviceService: DeviceDetectorService,
  constructor(
              public navCtrl: NavController,
              private taskProvider: TaskProvider,
              private userProvider:UserProvider,
              public navParams: NavParams,
              public translate:LanguageProvider,
              public taskprovider: TaskProvider,
              public user:UserProvider,
              // private fileChooser: FileChooser,
              /*private fileTransfer:FileTransfer,
              private file :File,
              private fileOpener:FileOpener,*/
              public modalCtrl: ModalController,
              public http:HttpClient,

  ) {
    this.userProvider.getUserById(localStorage.getItem('id')).subscribe((data: User) => {
      this.loggedInUser = data;
      console.log("logged in user:", this.loggedInUser);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeeklyReportPage');
  }
  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan());
    this.getMembers();
  }

  download(){
    window.location.href=this.url;
    /*if(this.deviceService.isDesktop()){
    window.location.href=this.url;}
    else{
      const transfer: FileTransferObject = this.fileTransfer.create();
      transfer.download(this.url, this.file.dataDirectory + 'iPlat4C-Weekly.docx').then((entry) => {
        this.fileOpener.open(this.file.dataDirectory + 'iPlat4C-Weekly.docx',"application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        console.log('download complete: ' + entry.toURL());
      }, (error) => {
        // handle error
        alert(error.code);
      });

    }*/
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

  follow(curTask: Task) {
    curTask.followedBy.push(this.loggedInUser);
    //curTask.updatedAt = new Date();
    let users: number[] = [];
    users.push(Number(localStorage.getItem('id')));
    this.taskProvider.addFollower(curTask.id.toString(), users).subscribe();
  }

  /**
   * Unfollow a prev followed task after clicking unfollow button. Modify followedBy and updatedAt variables
   * @param bodyText - bodyText of task to be unfollowed
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
  getMembers(){
    this.user.getUsers().subscribe((data:User[])=>{
      this.users=data;
      for(let t=0;t<this.users.length;t++){
        this.taskprovider.getUserTasks(this.users[t].id).subscribe((data:Task[])=>{
          console.log("get task by user "+"user name:"+this.users[t].name+"  Task: "+data);
          let member=new class implements members {
            Tasks: Task[];
            User: User;
          };
          member.User=this.users[t];
          member.Tasks=data;
          this.members.push(member)
        })
      }
      console.log("successgully assign data to local user array: "+ this.users);
    });
  }


}
