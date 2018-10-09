import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {RegistrationPage} from "../registration/registration";
import {TabsPage} from "../tabs/tabs";
import{LanguageProvider} from "../../providers/language/language";
import {AuthProvider} from "../../providers/auth/auth";
import {User, UserProvider} from "../../providers/user/user";
import {ForgotPwdPage} from "../forgot-pwd/forgot-pwd";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  activate:string="activate";
  constructor(public navCtrl: NavController, public navParams: NavParams,public translate: LanguageProvider,
              public authProvider: AuthProvider, public userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  goToSignup() {
    this.navCtrl.push(ForgotPwdPage);
  }

  login (eMail: string, passWord: string) {
    const user: User = {
      profileImgUrl: "",
      coverImgUrl: "",
      id: 0,
      email: eMail,
      password: passWord,
      privilege: "member",
      name: "",
      team: "",
      tasksCompleted: 0,
      completeTime: 0,
      avgTime: 0,
      language: 'zh'
    };
    this.authProvider.login(user).subscribe(data => {
      if (data != null) {
        console.log(data);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem( 'email', data.email);
        localStorage.setItem('name', data.name);
        localStorage.setItem('id', data.id);
        localStorage.setItem('curTeam', data.team);
        localStorage.setItem('privilege', data.privilege);
        localStorage.setItem('profileImageUrl', data.profileImgUrl);
        localStorage.setItem('coverImageUrl', data.coverImgUrl);
        localStorage.setItem('lang', data.language);
        if (data.language == 'en') {
          this.translate.setEng();
        } else if (data.language == 'zh') {
          this.translate.setChn();
        }
        this.navCtrl.setRoot(TabsPage);
      }
      // a null JSON object is returned if invalid login
      else {
        console.log('invalid login'); // todo print message for error login
        this.activate="inactivate"
      }
    });
  }
  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan())
  }
  registerTapped () {
    this.navCtrl.push(RegistrationPage);
  }

}
