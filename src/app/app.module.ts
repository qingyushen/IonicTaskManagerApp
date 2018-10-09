import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MembersPage } from "../pages/members/members";
import { OverviewPage } from "../pages/overview/overview";
import { TabsPage } from "../pages/tabs/tabs";
import { RegistrationPage } from "../pages/registration/registration";
import { TasksPage } from "../pages/tasks/tasks";
import { LoginPage } from "../pages/login/login";
import { SettingsPage } from "../pages/settings/settings";
import {WeeklyReportPage} from "../pages/weekly-report/weekly-report";
import {UpdatesPage} from "../pages/updates/updates";
import {FollowPage} from "../pages/follow/follow";
import {MePage} from "../pages/me/me";
import {InputPage} from "../pages/input/input";
import {GroupPage} from"../pages/group/group"
import {TaskdetailPage} from "../pages/taskdetail/taskdetail";
import { UserProvider } from '../providers/user/user';
import { TaskProvider } from '../providers/task/task';
import { HttpClient} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageProvider } from '../providers/language/language';
import { AuthProvider } from '../providers/auth/auth';
import { BackendProvider } from '../providers/backend/backend';
import {InterceptorModule} from "../auth/jwt.interceptor";
import {ScrollHideDirective} from "../pages/scroll-hide";
import {MembersDetailPage} from "../pages/members-detail/members-detail";
import { TimelineComponent } from '../components/timeline/timeline';
import { TimelineTimeComponent } from '../components/timeline/timeline';
import { TimelineItemComponent } from '../components/timeline/timeline';
import { GroupProvider } from '../providers/group/group';
import {AnalyticsPage} from "../pages/analytics/analytics";
import {CameraProvider} from "../providers/util/camera.provider";
import { Camera } from '@ionic-native/camera';
import { AnalyticsProvider } from '../providers/analytics/analytics';
import {FollowDetailPage} from "../pages/followdetail/followdetail";

import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {MemberDetailTaskInfoPage} from "../pages/member-detail-task-info/member-detail-task-info";
import {ForgotPwdPage} from "../pages/forgot-pwd/forgot-pwd";
import {ResetPwdPage} from "../pages/reset-pwd/reset-pwd";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent,
    ScrollHideDirective,
    MyApp,
    TabsPage,
    TasksPage,
    LoginPage,
    RegistrationPage,
    SettingsPage,
    InputPage,
    MembersPage,
    OverviewPage,
    WeeklyReportPage,
    UpdatesPage,
    FollowPage,
    MePage,
    TaskdetailPage,
    MembersDetailPage,
    GroupPage,
    AnalyticsPage,
    FollowDetailPage,
    ForgotPwdPage,
    MemberDetailTaskInfoPage,
    ResetPwdPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp,{backButtonText:''}),
    HttpClientModule,
    InterceptorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [ HttpClient]
      }
    }),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    TasksPage,
    LoginPage,
    RegistrationPage,
    SettingsPage,
    InputPage,
    MembersPage,
    OverviewPage,
    WeeklyReportPage,
    UpdatesPage,
    FollowPage,
    MePage,
    TaskdetailPage,
    MembersDetailPage,
    GroupPage,
    AnalyticsPage,
    MemberDetailTaskInfoPage,
    FollowDetailPage,
    ForgotPwdPage,
    ResetPwdPage
  ],
  providers: [
    FileTransfer,
    File,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    TaskProvider,
    LanguageProvider,
    AuthProvider,
    BackendProvider,
    GroupProvider,
    CameraProvider,
    Camera,
    AnalyticsProvider,

  ]
})
export class AppModule {}
