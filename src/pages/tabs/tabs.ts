import {Component, ViewChild} from '@angular/core';

import { TasksPage } from "../tasks/tasks";
import { OverviewPage } from "../overview/overview";
import {MePage} from "../me/me";
import {LanguageProvider} from "../../providers/language/language";
import {FollowPage} from "../follow/follow";
import { ScrollHideConfig } from '../scroll-hide';
import {Tabs} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabs:Tabs;
  tab1Root = TasksPage;
  tab2Root = FollowPage;
  tab3Root = OverviewPage;
  tab4Root = MePage;
  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };

  constructor(public translate: LanguageProvider) {
    this.translate.getTranslate().setDefaultLang(this.translate.getLan())
  }
  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan())
  }

}
