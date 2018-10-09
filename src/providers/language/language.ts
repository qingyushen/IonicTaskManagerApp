import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {UserProvider} from "../user/user";

/*
  Generated class for the LanguageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LanguageProvider {
  language: string = 'zh';
  constructor(public http: HttpClient,public translate: TranslateService, private userProvider: UserProvider) {
    console.log('Hello LanguageProvider Provider');
    if (localStorage.getItem('lang')) {
      this.language = localStorage.getItem('lang');
    }
  }
  public getTranslate(){
    return this.translate
  }
  public getLan(){
    return this.language
  }
  public setEng(){
    this.language='en'
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language);

  }
  public setChn(){
    this.language='zh'
    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language);
  }


}
