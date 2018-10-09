import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {User, UserProvider} from "../../providers/user/user";
import {LanguageProvider} from "../../providers/language/language";
import {MembersDetailPage} from "../members-detail/members-detail";
import {GroupProvider} from "../../providers/group/group";

/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})

export class MembersPage {
  memberIsAdmin: boolean;
  users: User[]=[]; // to display
  group:string=localStorage.getItem('curTeam');
  placeholder:string;
  alertMessage:string;
  alertTitle:string;
  cancel: string="Cancel";
  add: string="Add";
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userProvider: UserProvider,public  translate: LanguageProvider,public modalCtrl: ModalController,
              public alertCtrl: AlertController, public groupProvider: GroupProvider) {
    this.translate.getTranslate().get('input.cancel').subscribe(value => {
      this.cancel=value
    });
    this.translate.getTranslate().get('members.add').subscribe(value => {
      this.add=value
    });
    this.translate.getTranslate().get('members.placeholder').subscribe((value => {
      this.placeholder=value;
    }));
    this.translate.getTranslate().get('members.Message').subscribe((value => {
      this.alertMessage=value;
    }));
    this.translate.getTranslate().get('members.title').subscribe(value => {
      this.alertTitle=value
    });

    // 4.
    this.userProvider.checkUserAdmin(Number(localStorage.getItem('id'))).subscribe( data => {
      console.log("memberBeingViewed is: " + data.result);
      if (data.result == "admin") {
        this.memberIsAdmin = true;
        console.log(this.memberIsAdmin);
      } else {
        this.memberIsAdmin = false;
        console.log(this.memberIsAdmin);
      }
    });
  }



  showPrompt() {
    const prompt = this.alertCtrl.create ( {
      title: this.alertTitle,
      message: this.alertMessage,
      inputs: [
        {
          name: 'Email',
          placeholder: this.placeholder
        },
      ],
      buttons: [
        {
          text: this.cancel,
          handler: data => {
            console.log ( 'Cancel clicked' );
          }
        },
        {
          text: this.add,
          handler: data => {

            this.groupProvider.addMemberToGroup(data.Email).subscribe(data => {
              if (data == null) {
                console.log("invalid email")
                //todo handle this.
              } else {
                console.log(data);
                this.users.push(data);
              }
            })
            console.log ( 'Add clicked: adding ' + data.Email + " to group" );
          }
        }
      ]
    } );
    prompt.present();
  }


  ionViewWillEnter() {
    this.showUsers();
    console.log("ionViewWillEnter MembersPage");
    this.translate.getTranslate().use(this.translate.getLan())
  }


   openItem(user){
     let modal = this.modalCtrl.create(MembersDetailPage,{"user":user})
     modal.present();
   }
  showUsers() {

    this.userProvider.getUsers().subscribe((data: User[]) => {
      this.users = data;

      });
      for (let i = 0; i < this.users.length; i++) {
          console.log(this.users[i].email);
      }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
  }


}
