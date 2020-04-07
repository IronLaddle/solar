import { Injectable } from '@angular/core';

// socket client
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // socket client
  private socket: SocketIOClient.Socket;
  
  // user details
  private userDetails: Object;
  
  // jwt token
  private token: string;

  // inject services as private
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {

    // get user details
    this.userDetails = this.userService.getSession();

    // get token
    this.token = this.jwtService.getToken();
    
  }


  // create a socket connection
  connectSocket() {
   this.socket = io.connect(environment.api_url, { query: { token: this.token } });
   StaticSocket.setSocket(this.socket);
  }

  // listen on connected socket
  listenSocket() {

    // create observable return listening data

    let observable = new Observable(observer => {

      // listen on "NOTIFICATION"
      this.socket = io.connect(environment.api_url, { query: { token: this.token } });

      this.socket.on('NOTIFICATION', (data) => {
        console.log(2, data)
        observer.next(data);
      });

      return () => { this.socket.disconnect(); };
    });

    return observable;
  }


}

export default abstract class StaticSocket {

  static socket;
  static setSocket(data) {
    this.socket = data;
  }

  static getSocket() {
    return this.socket;
  }
}
