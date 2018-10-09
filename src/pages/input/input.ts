import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertController } from 'ionic-angular';
import { TaskProvider } from "../../providers/task/task";
import { Task } from "../../providers/task/task";
import {User, UserProvider} from "../../providers/user/user";
import {LanguageProvider} from "../../providers/language/language";
import {Group, GroupAuth} from "../../providers/group/group";


/**
 * Navigation: Clicking on the FAB in TasksPage
 * Usage: Input a new task
 */
@IonicPage()
@Component({
  selector: 'page-input',
  templateUrl: 'input.html',
})
export class InputPage {
  visibility: number = 1;// default value 0 means private, 1 stands for public
  names: string[] = [];
  allUsers: User[] = []; // all the users in loggedInUser's group
  loggedInUser: User;
  taskAssignedTo: User[] = [];
  dueDate: string; // duedate
  task: string = " ";
  //translation variables
  labelPublic:string;
  labelPrivate:string;
  alertTitle:string;
  cancel: string="Cancel";
  okay: string="Okay";
  assignedToPlaceHolderTitle: string = "Assign this task to:(assigned task will be displayed on following page) ";
  taskAssignedToName: string[] = []; // HTML variable for assignedToRadio
  visibleState: string = "Public"; // whether new task is public or private, default is public

  /**
   * Set the language
   * @param navCtrl
   * @param navParams
   * @param taskprovider
   * @param userProvider
   * @param translate
   * @param alertCtrl
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, private taskprovider: TaskProvider,
              private userProvider: UserProvider, private translate: LanguageProvider,
              public alertCtrl: AlertController) {

    this.translate.getTranslate().setDefaultLang(this.translate.getLan());

    // Set the due date with leading 0s for ISO 8601 format and ion-datetime tag compatibility
    let date: Date = new Date();
    this.dueDate = date.getFullYear().toString() + '-';
    if (date.getMonth()+1 < 10) {
      this.dueDate = this.dueDate + '0' + (date.getMonth()+1).toString() + '-';
    } else {
      this.dueDate = this.dueDate + (date.getMonth()+1).toString() + '-';
    }
    if (date.getDate() < 10) {
      this.dueDate = this.dueDate + '0' + date.getDate().toString();
    } else {
      this.dueDate = this.dueDate + date.getDate().toString();
    }
  }

  /**
   * Initalize the users global variable and do translation
   */
  ionViewWillEnter(){
    this.userProvider.getUsers().subscribe((data: User[]) => {
      this.allUsers=data});
    this.userProvider.getUserById(localStorage.getItem('id')).subscribe((data: User) => {
      this.loggedInUser = data;
      this.taskAssignedTo.push(data);
    });
    this.translate.getTranslate().use(this.translate.getLan())
    this.translate.getTranslate().get('input.title').subscribe(value => {
      this.assignedToPlaceHolderTitle = value;
    });
    this.translate.getTranslate().get('input.cancel').subscribe(value => {
      this.cancel=value
    });
    this.translate.getTranslate().get('input.okay').subscribe(value => {
      this.okay=value
    });
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

  clear(){
    this.task=""
  }

  /**
   * Radio for public and private visibility of task
   */
  setVisibleRadio() {
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
        if (data  ==  "Private"){
          this.visibility = 0;
        }
        if (data == "Public") {
          this.visibility = 1;
        }
        console.log('Radio data:', data,', visibility:',this.visibility);
        this.visibleState = data;
      }
    });
    alert.present();
  }

  /**
   * Getting the list of assignedTo users and handling what happens when you click on them
   */
  assignedToRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.assignedToPlaceHolderTitle);
    // these people here should be get from back end
    //replace name in the value with email

    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].name == localStorage.getItem('name')) {
        continue;
      }
      alert.addInput({
        type: 'checkbox',
        label: this.allUsers[i].name,
        value: this.allUsers[i].id.toString(),
        checked: false
      });
    }

    alert.addButton(this.cancel);
    alert.addButton({
      text: this.okay,
      handler: (data: string[]) => {
        // console.log("all users:");
        // console.log(this.allUsers);
        // console.log("printing data");
        // console.log(data);
        let assigned: boolean = false;
        // Empty taskAssignedTo if more than 1 user radio button clicked on or only 1 user radio but that user
        // is different from current user
        if (data.length > 1 || (data.length == 1 && data[0] != this.loggedInUser.id.toString()) ) {
          console.log(this.taskAssignedTo);
          console.log("reset taskAssignedTo");
          this.taskAssignedTo = [];
          console.log(this.taskAssignedTo);
          assigned = true;
        }
        // The for loop will add loggedInUser so this will prevent duplicate
        if (data.length == 1 && data[0] == this.loggedInUser.id.toString()) {
          this.taskAssignedTo = [];
        }
        for (let i = 0; i < this.allUsers.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (this.allUsers[i].id.toString() == data[j]) {
              this.taskAssignedTo.push(this.allUsers[i]);
            }
          }
        }
        console.log('Checkbox data:', data);
        this.taskAssignedToName = data;
      }
    });
    alert.present();
  }

  /**
   * Helper function to check if bodyText is empty or not
   * @param str
   */
  isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

  /**
   * Shows an alert, called in add() when bodyText is empty or white spaces.
   */
  showEmptyTextAlert() {
    let alert = this.alertCtrl.create({
      title: "No text entered",
      message: "Cannot add an empty task",
      buttons: [
        {
          text: "Continue",
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  add(task: string) {
    let allTasks: Task[] = [];
    let taskFollowedBy: User[] = [this.loggedInUser];
    // Add all tasks to allTasks array
    console.log("printing assigned to array:");
    console.log(this.taskAssignedTo);

    // If bodyText is empty or white spaces then display an error alert
    if (this.isEmptyOrSpaces(task)) {
      this.showEmptyTextAlert();
      return;
    }
    for (let i = 0; i < this.taskAssignedTo.length; i++) {
      const curTask: Task = {
        id: 0,
        authorName: localStorage.getItem('name'),
        authorID: localStorage.getItem('id'),
        assignedToName: this.taskAssignedTo[i].name,
        assignedToID: this.taskAssignedTo[i].id,
        bodyText: task.toString(),
        dateTime: new Date(),
        dueDate: this.dueDate,
        done: 0, // todo - do a check to see if should initially be done = true
        visible: this.visibility, // todo - add a check for this in HTML
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        completedDay: 0,
        groupName: localStorage.getItem('curTeam'),
        followed: 0,
        followedBy: taskFollowedBy,
      };
      allTasks.push(curTask);
    }
     // console.log("InputPage add method:" + curTask);
    this.taskprovider.saveTasks(allTasks).subscribe(data => this.navCtrl.pop());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InputPage');
  }

}
