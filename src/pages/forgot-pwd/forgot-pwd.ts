import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider,userEmail} from "../../providers/user/user";
import {ResetPwdPage} from "../reset-pwd/reset-pwd";

/**
 * Generated class for the ForgotPwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-pwd',
  templateUrl: 'forgot-pwd.html',
})
export class ForgotPwdPage {
  tokenAuth:boolean=false;
  emailAdrs:string;
  tokenName:string;
  active:string="inactive";
  alert:boolean=false;
  alertToken:boolean=false;
  tokenInvalid:string="验证码错误";
  tokenExpired:string="验证码过期";
  alert2:string;
  expire:boolean=false;
  invalid:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams ,public user: UserProvider) {
  }
  authenToken(tokenName){
  this.user.authenPwd(tokenName).subscribe(data=>{
    console.log(data.result);
    if(data.result=="tokenValid"){
      this.alert=false;
      this.alertToken=false;
      console.log("authenToken success");
      this.navCtrl.push(ResetPwdPage,{
        email:this.emailAdrs,
        token:this.tokenName
      });
    }
    else{
      this.alertToken=true;
      console.log("authenTokem fail")
      if(data.result=="tokenInvalid"){
        this.invalid=true;
        this.alert2==this.tokenInvalid;
      }
      if(data.result=="tokenExpired"){
        this.expire=true;
        this.alert2==this.tokenExpired;
      }
    }
  })
  }
  sendToken(email){
    const userEmail:userEmail={
      email:email
    };
    console.log("email sent: "+ email);
    if (email == '' || email== null) {
      this.tokenAuth=false;
      this.alert=true;
      console.debug("请填写邮箱!");
      return;
    }
    else{
      this.tokenAuth=true;
      this.user.changePwd(userEmail).subscribe(data=>{
        console.log(data.result);
        console.log(userEmail);
        if(data.result=="success"){
          this.active='active';
          this.verifyCode.disable = false;
          this.settime();
          console.log("success")
        }
        else{
          this.alert=true;
          console.log("fail")
        }
      });
    }
    //发送验证码成功后开始倒计时


  }

  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  };

  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      return;
    } else {
      this.verifyCode.countdown--;
    }
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
      this.settime();
    }, 1000);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPwdPage');
  }

}
