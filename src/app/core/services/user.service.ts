import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    // get user session
    getSession(): Object {
        let _session = localStorage.getItem('Session');
        _session = (_session) ?  JSON.parse(atob(_session)) : '';
        console.log(_session)
        return _session;
    }

    // update / save user session
    updateSession(session) {
        let _session = session
        _session['session_time'] = Date();

        _session = btoa(JSON.stringify(_session))
        localStorage.setItem('Session', _session);
    }

    // update user session time 
    updateSessionTime() {
        let _session = this.getSession();
        _session['session_time'] = Date();
        
        let _updatedSession = btoa(JSON.stringify(_session));
        
        localStorage.setItem('Session', _updatedSession);
    }

    // destory Session
    destroySession() {
        localStorage.removeItem('Session');
    }

    // validate user session
    validateSession(): boolean {
        
        // get current and logged/updated session
        const _currentDate = new Date();

        const _session = this.getSession();
        const _sessionDate = new Date(_session['session_time']);

        // calc time difference in hours
        const _sessionDiffernce = Math.abs( _currentDate.getTime() - _sessionDate.getTime()) / 36e5;
        
        // validate with session timeout and return result
        const _sessionValid = (_sessionDiffernce <= environment.session_time_limit) ? true : false;
        return _sessionValid;
    }

   
}