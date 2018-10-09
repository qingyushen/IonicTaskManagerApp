import {Injectable, NgModule} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Events} from "ionic-angular";
import {tap} from "rxjs/operators";
import {UserProvider} from "../providers/user/user";
import {globalUrl} from "../providers/backend/backend";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(public events: Events, public userProvider: UserProvider) {

  }

  /**
   *This adds a custom header to modify http requests. It adds jwt auth token if user logged in
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (request.headers.has('InterceptorSkipHeader')) {
    //   console.log('skip adding header')
    //   const headers = request.headers.delete('InterceptorSkipHeader');
    //   return next.handle(request.clone({ headers }));
    // }
    // add authorization header with jwt token if available
    const re = /auth/;
    const down =/download/;
    if (request.url.startsWith(globalUrl) && (request.url.search(re) === -1 || request.url.search(down)===-1) ){
      let token = localStorage.getItem('authToken');
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          }
        });
      }


      return next.handle(request) // todo handle go to login page logic
        .pipe(tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // https://forum.ionicframework.com/t/how-to-change-page-from-service-injectable/48018/28
              // better alternate solns available
              console.log('jwt executes 401 handling.')
              this.events.publish('session:expired');
            }
          }
        }));
    } else {
      return next.handle(request)
    }
  }
}

@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ]
})
export class InterceptorModule {
}
