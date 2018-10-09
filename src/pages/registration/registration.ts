import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {LanguageProvider} from "../../providers/language/language";
import {AuthProvider, RegisterInfo} from "../../providers/auth/auth";
import {LoginPage} from "../login/login";

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  username:string;
  email:string;
  password:string;
  group:string;
  groupPassword: string;
  judge:string="active"; // boolean for checking if email already registered
  judgepwd:string="active";
  Username:string="User name";
  Email:string="Email";
  Password:string="enter your password";
  Cpassword:string="confirm your password"
  Group:string="group name";
  cancel: string="Cancel";
  okay: string="Okay";
  status:number=0;
  visibleState:string;
  title:string="Choose an action";
  GroupPwd:string;
  CgroupPwd:string;
  Join:string;
  cReate:string;
  alertTitle:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public translate: LanguageProvider, public authService: AuthProvider,public alertCtrl: AlertController) {
    this.translate.getTranslate().get('register.Username').subscribe(value => {
      this.Username = value;
    });
    this.translate.getTranslate().get('register.Email').subscribe(value => {
      this.Email = value;
    });
    this.translate.getTranslate().get('register.Password').subscribe(value => {
      this.Password= value;
    });
    this.translate.getTranslate().get('register.Cpassword').subscribe(value => {
      this.Cpassword = value;
    });
    this.translate.getTranslate().get('register.Group').subscribe(value => {
      this.Group = value;
    });
    this.translate.getTranslate().get('register.GroupPwd').subscribe(value => {
      this.GroupPwd = value;
    });
    this.translate.getTranslate().get('register.CgroupPwd').subscribe(value => {
      this.CgroupPwd = value;
    });
    this.translate.getTranslate().get('register.join').subscribe(value => {
      this.Join= value;
    });
    this.translate.getTranslate().get('register.create').subscribe(value => {
      this.cReate = value;
    });
    this.translate.getTranslate().get('register.alertTitle').subscribe(value => {
      this.alertTitle = value;
    });
    this.translate.getTranslate().get('input.cancel').subscribe(value => {
      this.cancel = value;
    });
    this.translate.getTranslate().get('input.okay').subscribe(value => {
      this.okay = value;
    });
  }


  /**
   * Sends a Post request to register the user
   */
  setTeam() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.alertTitle);
    alert.addInput({
      type: 'radio',
      label: this.Join,
      value: this.Join,
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: this.cReate,
      value: this.cReate
    } );

    alert.addButton(this.cancel);
    alert.addButton({
      text: this.okay,
      handler: data => {
        if (data  == "Join a team" || data=="加入小组"){
          this.status = 0;
        }
        if (data == "Create a team" || data=="创建小组" ) {
          this.status = 1;
        }
        console.log('Radio data:', data,',status:',this.status);
        this.visibleState = data;
      }
    });
    alert.present();
  }
  send() {
    let data: RegisterInfo ={
      name:this.username,
      email:this.email,
      groupName: this.group,
      password:this.password,
      groupPassword: this.groupPassword
    };
    if(this.group=="" || this.group==null){
      data.groupName = "default"
    }
    if (data.groupPassword == null) {
      data.groupPassword = '';
    }
    console.log(data);
    this.authService.register(data).subscribe((val) => {
        console.log("POST call successful value returned in body",
          val);
        if(val!=null){
          this.navCtrl.popTo(LoginPage)
        }
        else{
          this.judge="deactive";
          this.judgepwd="deactive"
        }
      },
      response => {
        console.log("POST call in error", response);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
  }
  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan());
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

}
