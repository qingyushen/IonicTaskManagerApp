import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LanguageProvider} from "../../providers/language/language"
import {UserProvider} from "../../providers/user/user";
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  Lan:string='';
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: LanguageProvider,
              private userProvider: UserProvider) {

  }

  setChn() {
    this.translate.setChn();
    this.userProvider.changeLanguage('zh').subscribe();
    localStorage.setItem('lang', 'zh');
  }

  setEng() {
    this.translate.setEng();
    this.userProvider.changeLanguage('en').subscribe();
    localStorage.setItem('lang', 'en');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }


  ionViewWillEnter() {
    this.translate.getTranslate().use(this.translate.getLan());
    if(this.translate.getLan()=='en'){
      this.Lan='English'
    }
    else{
      this.Lan='中文'
    }

  }

  // /**
  //  * Create an alert that prompts user for password to confirm that they want to delete their account
  //  */
  // confirmDelete() {
  //
  // }

}
