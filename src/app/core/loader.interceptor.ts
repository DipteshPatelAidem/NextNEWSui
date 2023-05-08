import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { LoaderService } from "./loader.service";
import { catchError, finalize, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private _loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('GetContactPersons') < 0) {
      this.totalRequests++;
     // this._loaderService.ShowLoader();
    }

    return next.handle(request).pipe(
      catchError((error, caught) => {
       // this._loaderService.HideLoader();
        this.handleAuthError(error);
        return of(error);
      }) as any,
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
         // this._loaderService.HideLoader();
        }
      })
    );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // if (err.error.message == 'Token Expired.') {
    //     localStorage.clear();
    //     this.router.navigate(['auth/login']);
    //     throw err;
    // }
    // switch (err.status) {
    //     case 401:
    //         localStorage.clear();
    //         this.router.navigate(['auth/login']);
    //         break;
    //     case 400:
    //     // localStorage.clear();
    //     // this.router.navigate(['auth/login']);
    //     // break;
    // }
    throw err;
  }
}
