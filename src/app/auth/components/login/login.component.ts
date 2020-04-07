import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService, JwtService, UserService, SocketService } from 'src/app/core';
import { Router } from '@angular/router';
import * as URLConstant from '../../../constant/URLConstant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //@ViewChild('username', null) private elementRef: ElementRef;

  // form
  loginForm: FormGroup;
  formSubmit: Boolean = false;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private socketService: SocketService) {

    // clear localstorage 
    this.jwtService.destroyToken();
    this.userService.destroySession();

    // create login form
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.elementRef.nativeElement.focus();
  }

  // submit login form
  submit() {
    // validate form
    if (!this.loginForm.valid) 
      return this.toastr.warning('Invalid user credentials');

    // get user data
    this.formSubmit = true;
    //this.apiService._post('login-user', this.loginForm.value).subscribe(response => {
      this.apiService._post(URLConstant.LOGIN, this.loginForm.value).subscribe(response => {
      // disable form loader
      this.formSubmit = false;

      // validatte response status
      if (!response.success) 
        return this.toastr.warning('Invalid user credentials');

      // update token and session
      this.jwtService.saveToken(response.access_token);

      // added user name to response for socket
      let _sessionData = response.data;
      _sessionData['username'] = this.loginForm.controls['username'].value;

      this.userService.updateSession(_sessionData);

      // create socket connection
      // this.socketService.connectSocket();

      // route to home with alert success on login
      //this.toastr.success(response.message);
      this.router.navigate(['/home'])
      
    });
  }

}
