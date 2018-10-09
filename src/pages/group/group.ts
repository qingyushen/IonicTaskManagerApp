import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Group, GroupAuth, GroupProvider} from "../../providers/group/group";
import {LanguageProvider} from "../../providers/language/language";

/**
 * Generated class for the GroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  groups: Group[]; // All the groups of user except current group they are viewing
  currentGroup: Group; // current group of current user
  newGroup:string;
  cancel:string="Cancel";
  add:string="Add";
  group:string;
  password:string;
  confirm:string;
  yes:string;
  no:string;
  switchMessage:string;
  deleteMessage:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public groupProv: GroupProvider,public translate: LanguageProvider) {
    this.translate.getTranslate().setDefaultLang(this.translate.getLan())
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPage');
  }

  /**
   * Initialize the groups and current groups variables everytime upon entering this page.
   */
  ionViewWillEnter() {
    this.findTeams();
    this.translate.getTranslate().get('group.newGroup').subscribe(value => {
      this.newGroup= value;
    });
    this.translate.getTranslate().get('group.cancel').subscribe(value => {
      this.cancel= value;
    });
    this.translate.getTranslate().get('group.add').subscribe(value => {
      this.add= value;
    });
    this.translate.getTranslate().get('group.group').subscribe(value => {
      this.group= value;
    });
    this.translate.getTranslate().get('group.password').subscribe(value => {
      this.password= value;
    });
    this.translate.getTranslate().get('group.confirm').subscribe(value => {
      this.confirm= value;
    });
    this.translate.getTranslate().get('group.yes').subscribe(value => {
      this.yes= value;
    });
    this.translate.getTranslate().get('group.no').subscribe(value => {
      this.no= value;
    });
    this.translate.getTranslate().get('group.switch').subscribe(value => {
      this.switchMessage= value;
    });
    this.translate.getTranslate().get('group.deleteG').subscribe(value => {
      this.deleteMessage= value;
    });
  }

  /**
   * Find all the groups that LoggedInUser is a part of.
   */
  findTeams() {
    this.groupProv.getGroups().subscribe(data => {

      this.groups = data;
      for (let i = 0; i < this.groups.length; i ++) {
        if (this.groups[i].name == localStorage.getItem('curTeam')) {
          this.currentGroup = this.groups[i];
          break;
        }
      }
      let index = this.groups.indexOf(this.currentGroup, 0);
      if (index > -1) {
        this.groups.splice(index, 1);
      }
      console.log(this.groups)
      console.log(this.currentGroup.name)
    })
  }

  /**
   * Confirmation alert for switching groups
   * @param team
   */
  showConfirmAlert(team: Group) {
    let alert = this.alertCtrl.create({
      title: this.confirm,
      message: this.switchMessage + team.name + '?',
      buttons: [
        {
          text: this.no,
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.yes,
          handler: () => {
            localStorage.setItem('curTeam', team.name);
            this.findTeams();
            this.groupProv.switchGroup(team.name).subscribe(data => {
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('privilege', data.privilege );
              console.log("token has changed to: " + data.token);
            });
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * FAB pressed to add new group, get a popup to add new group
   */
  addGroup() {
    let alert = this.alertCtrl.create({
      title: this.newGroup,
      inputs: [
        {
          name: 'groupName',
          placeholder: this.group
        },
        {
          name: "groupPassword",
          placeholder: this.password
        }
      ],
      buttons: [
        {
          text: this.cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.add,
          handler: (data: GroupAuth) => {
            this.groupProv.addGroup(data).subscribe( (out) => {
              if (out.result == "newGroup" || out.result == "joinGroup" ) {
                let groupToAdd: Group = {
                  id: -1,
                  name: data.groupName,
                };
                this.groups.push(groupToAdd);
                console.log("Added group " + (data.groupName));
              } else {
                console.log("Cannot join group") // todo handle front end for this
              }
            });

          }
        }
      ]
    });
    alert.present();
  }

  showDeleteConfirm(team: Group) {
    let alert = this.alertCtrl.create({
      title: this.confirm,
      message: this.deleteMessage + team.name + '?',
      buttons: [
        {
          text: this.no,
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.yes,
          handler: () => {
            // Delete the team from being displayed
            let index = this.groups.indexOf(team, 0);
            if (index > -1) {
              this.groups.splice(index, 1);
            }
            // Delete from backend
            let auth: GroupAuth = {
              groupName: team.name,
              groupPassword: undefined,
            }
            this.groupProv.leaveGroup(auth).subscribe(data => {});
          }
        }
      ]
    });
    alert.present();
  }
}
