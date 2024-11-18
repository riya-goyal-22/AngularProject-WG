import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { EMPTY, Observable } from "rxjs";


export const AuthInterceptor: HttpInterceptorFn =
(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const skipUrls = ['/signup', '/login', '/forgot-password', '/admin/login'];
    if(skipUrls.some(url => req.url.includes(url))) {
      return next(req);
    }
    const router = inject(Router)
    const token = localStorage.getItem('token')
    if (!token) {
      router.navigate(['/login'])
      return EMPTY
    }
    const newRequest = req.clone({
      setHeaders: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    return next(newRequest);
}