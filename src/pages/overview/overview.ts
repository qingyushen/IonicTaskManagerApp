import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {UpdatesPage} from "../updates/updates";
import {WeeklyReportPage} from "../weekly-report/weekly-report";
import {MembersPage} from "../members/members";
import {LanguageProvider} from "../../providers/language/language";
import {AnalyticsPage} from "../analytics/analytics";
import {TaskProvider} from "../../providers/task/task";

/**
 * NavigationFrom: Third tab of TabsPage
 * NavigationTo: MembersPage, WeeklyReportPage, UpdatesPage, AnalyticsPage
 */
@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html',
})
export class OverviewPage {
  categories: Array<{title: string, page: any, icon: string}>;
  members: {title: string, page: any, icon: string};
  analytics: {title: string, page: any, icon: string};

  constructor(public navCtrl: NavController, public navParams: NavParams,public translate:LanguageProvider,
              public taskProvider: TaskProvider) {
    this.categories = [
      { title: "Team updates", page: UpdatesPage, icon: "ios-pie-outline"},
      { title: "Weekly report", page: WeeklyReportPage, icon: "calendar"}

    ];
    this.members = {title: "Members", page: MembersPage, icon: "contacts"};
    this.analytics = {title: "Analytics", page: AnalyticsPage, icon: "stats"};
    this.translate.getTranslate().setDefaultLang(this.translate.getLan())
  }

  /**
   * Navigate to any of the rows clicked
   * @param event - The event that triggers navigation
   * @param item - Object containing the new page to navigate to
   */
  itemTapped(event, item) {
    if (item.title == "Weekly report") {
      this.taskProvider.emailDoc().subscribe();
      console.log("emailDoc called")
    }
    this.navCtrl.push(item.page)
  }

  /**
   * Get the page layout in specified language
   */
  ionViewWillEnter(){
    this.translate.getTranslate().use(this.translate.getLan())
    this.translate.getTranslate().get('overview.Weekly Report').subscribe(value => {
      this.categories[1].title=value
    })
    this.translate.getTranslate().get('overview.Updates').subscribe(value => {
      this.categories[0].title=value
    })
    this.translate.getTranslate().get('overview.members').subscribe(value => {
      this.members.title=value
    })
    this.translate.getTranslate().get('overview.analytics').subscribe(value => {
      this.analytics.title=value
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
  }

}
