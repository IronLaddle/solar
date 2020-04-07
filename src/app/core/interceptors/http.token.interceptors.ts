import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// jwt service
import { JwtService } from 'src/app/core/services/jwt.service';

// user service
import { UserService } from 'src/app/core/services/user.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    constructor(private jwtService: JwtService, private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // get token
        const token = this.jwtService.getToken();

        // token present set authorization header and update user session time
        if (token) {
            this.userService.updateSessionTime();

            return next.handle(
                req.clone({
                    headers: req.headers.append('Authorization', 'Bearer ' + token)
                })
            );

        }
        return next.handle(req);
    }
}