import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService, ApiService, SocketService } from 'src/app/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as URLConstant from '../../../constant/URLConstant';
import { NotificationModel } from 'src/app/model/NotificationModel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // user details
  userDetails: Object;
  activeParams;
  // hamburger hide/show status
  hamburgerStatus = false;

  notify : NotificationModel[];
  notifiyCount : number;
  showAnnotation : Boolean;
  modalRef: BsModalRef;

  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private socketService: SocketService,
    private modalService: BsModalService
  ) {
    // get user details form session
    this.userDetails = this.userService.getSession();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('home/site/site-detail')) {
          this.showAnnotation = true;
        } else {
          this.showAnnotation = false;
        }
      }
    })
  }

  ngOnInit() {
    this.getNotification();
  }

  getNotification(){
    this.apiService._get(URLConstant.NOTIFICATIONS).subscribe(response => {
      //+"?skip=5&limit=5"
      this.notify = response.data;
      this.notifiyCount = this.notify.length;
    })
  }

 
  logout (){
    window.location.href="/auth/login";
  }

  viewSites(){
    this.router.navigate(['home/site']);
  }

  newSite(){
    console.info("site management");
    this.router.navigate(['home/newproject']);
  }

  userMgmnt(){
    this.router.navigate(['home/user-mgmnt']);
  }

  annotateMgmnt(){

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }
  
}
