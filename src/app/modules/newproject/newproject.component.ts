import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core';
import * as URLConstant from '../../../app/constant/URLConstant';

@Component({
  selector: 'app-newproject',
  templateUrl: './newproject.component.html',
  styleUrls: ['./newproject.component.css']
})
export class NewprojectComponent implements OnInit {

  newProjectForm: FormGroup;
  formSubmit: Boolean = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService
  ) { 
    this.newProjectForm = new FormGroup({
      siteName: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      siteAddress: new FormControl(null, [Validators.required]),
      totalMw: new FormControl(null, [Validators.required]),
      company: new FormControl(null, [Validators.required]),
      folderName: new FormControl(null, [Validators.required]),
      pilot1: new FormControl(null, [Validators.required]),
      pilot2: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
  }

  submit(){
    if(!this.newProjectForm.valid)
      //return this.toastr.warning('Invalid ');

    this.formSubmit = true;
    console.info(this.newProjectForm.value)
    this.apiService._post(URLConstant.SITES, this.newProjectForm.value).subscribe(response => {
      this.formSubmit = false;
      this.toastr.success(response.message);
      //this.router.navigate(['/home'])
    });

  }

  cancel(){
    this.newProjectForm.reset();
  }

}
