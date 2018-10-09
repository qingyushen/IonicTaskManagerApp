import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {LoginPage} from "../login/login";
import { App } from 'ionic-angular';
import {LanguageProvider} from"../../providers/language/language"
import {GroupPage} from "../group/group";
import {User, UserProvider} from "../../providers/user/user";
import {HttpClient} from "@angular/common/http";

/**
 * Navigation: 4th tab on TabsPage. Contains Translation, groups and logout functions
 */
@IonicPage()
@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
})
export class MePage {
  placeholder =localStorage.getItem('profileImageUrl');
  chosenPicture: any;
  cancel: string="Cancel";
  okay: string="Okay";

  user: User = {
    profileImgUrl: localStorage.getItem('profileImageUrl'),
    coverImgUrl: localStorage.getItem('coverImg'),
    id: 27,
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    password: "",
    privilege: localStorage.getItem('privilege'),
    team: localStorage.getItem('curTeam'),
    completeTime: 0,
    tasksCompleted: 0,
    avgTime: 0,
    language: localStorage.getItem('language')
  };

  tabs: Array<{title: string, page: any, icon: string }>; // Temp including loging, registration here for testing purposes

  constructor(public navCtrl: NavController,  public http: HttpClient, private alertCtrl: AlertController,
              public navParams: NavParams,private app:App,public translate:LanguageProvider,
              public userProvider: UserProvider) {
    this.tabs = [
      {title: "Settings", page: SettingsPage, icon: "settings"},
      {title: "Groups", page: GroupPage,icon:"people"},
      {title: "logout", page: LoginPage, icon: "power"},
    ];
    this.translate.getTranslate().setDefaultLang(this.translate.getLan())
  }

  changePicture(){
    let alert = this.alertCtrl.create();
    alert.setTitle("请选择头像");
    alert.addInput({
      type: 'radio',
      label: "鼠",
      value: "rat",
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: "牛",
      value: "ox",
    });
    alert.addInput({
      type: 'radio',
      label: "虎",
      value: "tiger",
    });
    alert.addInput({
      type: 'radio',
      label: "兔",
      value: "rabbit",
    });
    alert.addInput({
      type: 'radio',
      label: "龙",
      value: "dragon",
    });
    alert.addInput({
      type: 'radio',
      label: "蛇",
      value: "snake",
    });
    alert.addInput({
      type: 'radio',
      label: "马",
      value: "horse",
    });
    alert.addInput({
      type: 'radio',
      label: "羊",
      value: "goat",
    });
    alert.addInput({
      type: 'radio',
      label: "猴",
      value: "monkey",
    });
    alert.addInput({
      type: 'radio',
      label: "鸡",
      value: "rooster",
    });
    alert.addInput({
      type: 'radio',
      label: "狗",
      value: "dog",
    });
    alert.addInput({
      type: 'radio',
      label: "猪",
      value: "pig",
    });
    alert.addButton(this.cancel);
    alert.addButton({
      text: this.okay,
      handler: (data: string) => {
        this.placeholder="./assets/img/"+data+".jpeg"
        localStorage.setItem('profileImageUrl',this.placeholder);
        this.userProvider.changeProfileImg(this.placeholder).subscribe();
      }
    });
    alert.present()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MePage');
  }

  ionViewWillEnter() {
    this.translate.getTranslate().use(this.translate.getLan());

    this.translate.getTranslate().get('Me.Settings').subscribe(value => {
      this.tabs[0].title=value
    });
    this.translate.getTranslate().get('Me.Group').subscribe(value => {
      this.tabs[1].title=value
    });
    this.translate.getTranslate().get('Me.logout').subscribe(value => {
      this.tabs[2].title=value
    });
    this.translate.getTranslate().get('input.cancel').subscribe(value => {
      this.cancel=value
    });
    this.translate.getTranslate().get('input.okay').subscribe(value => {
      this.okay=value
    });

    this.user = {
      profileImgUrl: localStorage.getItem('profileImageUrl'),
      coverImgUrl: localStorage.getItem('coverImageUrl'),
      id: 27,
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      password: "",
      privilege: localStorage.getItem('privilege'),
      team: localStorage.getItem('curTeam'),
      completeTime: 0,
      tasksCompleted: 0,
      avgTime: 0,
      language: localStorage.getItem('language'),
    };
  }

  /**
   * Navigate to either group, setting or logout(LoginPage)
   * @param event
   * @param tab
   */
  onClick(event, tab) {
    if (tab.page == LoginPage) {
      localStorage.clear();
      this.app.getRootNav().setRoot(LoginPage);
    }
    else {
      this.navCtrl.push(tab.page);
    }
  }
}
