import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider,newPwd} from "../../providers/user/user";
import {HttpClient} from "@angular/common/http";
import {LoginPage} from "../login/login";

/**
 * Generated class for the ResetPwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-pwd',
  templateUrl: 'reset-pwd.html',
})
export class ResetPwdPage {
  password:string;
  repassword:string;
  emailAdrs:string;
  token:string;
  alertPwd:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public user:UserProvider,private app:App) {
    this.emailAdrs=this.navParams.get('email');
    this.token=this.navParams.get('token');
  }
  resetPwd(password){
    console.log("email: "+ this.emailAdrs);
    console.log("token"+this.token);
    const newpass: newPwd={
      email:this.emailAdrs,
      password:password,
      token: this.token
    }
    this.user.updatePwd(newpass).subscribe(data=>{
      console.log("newPwd: "+ newpass);
      if(data.result==1){
        this.app.getRootNav().setRoot(LoginPage);
      }
      else{
        this.alertPwd=true;
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPwdPage');
  }

}
