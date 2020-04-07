import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// jwt service
import { JwtService, UserService } from 'src/app/core/services';



@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
            // validate token and user expeire session
        if (this.jwtService.getToken() && this.userService.validateSession()) {
            return true
        } else {
            // validation failed route to login page
            this.router.navigate(['/auth']);
            return false;
        }
    }
}