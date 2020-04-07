import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileModel } from 'src/app/model/ProfileModel';
import * as URLConstant from '../../../app/constant/URLConstant';
import { ApiService } from 'src/app/core';
import { OrganizationModel } from 'src/app/model/OrganizationModel';

@Component({
  selector: 'app-user-mgmnt',
  templateUrl: './user-mgmnt.component.html',
  styleUrls: ['./user-mgmnt.component.css']
})
export class UserMgmntComponent implements OnInit {

  //form
  userMgtForm: FormGroup;
  formSubmit: Boolean = false;

  profiles : ProfileModel[];
  organization :OrganizationModel;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService 
  ) { 
    //user form
    this.userMgtForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    })

  }

  ngOnInit(): void {
    this.profiles = new Array<ProfileModel>();
    this.userProfDetails();
  }

  userProfDetails(){
    this.apiService._get(URLConstant.PROFILES).subscribe(resp => {
      let profilesRes : ProfileModel[] = resp.data;
      this.profiles = new Array<ProfileModel>();
        for(let orgAll of profilesRes){
          this.apiService._get(URLConstant.ORGANIZATIONS+ '/'+ orgAll.organization_id).subscribe(resp => {
          this.organization = resp.data;
          orgAll.organization_name = this.organization.name;
        })
        this.profiles.push(orgAll);
      }
    })
  }

  createNewUser(){
    this.toastr.info('User Created');
  }

  cancel(){
    this.userMgtForm.reset();
  }

  submit(){
    if(!this.userMgtForm.valid)
      return this.toastr.warning('Invalid ');
    console.info(this.userMgtForm.value);
    this.formSubmit = true;
    this.apiService._post(URLConstant.PROFILES, this.userMgtForm.value).subscribe(response => {
      this.formSubmit = false;
      this.toastr.success(response.message);
      //this.router.navigate(['/home'])
    });

  }

}
