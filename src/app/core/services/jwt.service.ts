import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JwtService {

    // get token by decrypt
    getToken(): string {
        let _token = localStorage.getItem('Token');
        _token = (_token) ? atob(_token) : '';
        return _token;
    }

    // save token by encrypt
    saveToken(token: string) {
        let _token = btoa(token);
        localStorage.setItem('Token', _token)
    }

    // destory token
    destroyToken() {
        localStorage.removeItem('Token');
    }

}