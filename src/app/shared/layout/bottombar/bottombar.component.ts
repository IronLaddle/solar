import { Component, OnInit } from "@angular/core";

// Service
import { ApiService } from "src/app/core/services";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

declare var $: any;
@Component({
  selector: "app-bottombar",
  templateUrl: "./bottombar.component.html",
  styleUrls: ["./bottombar.component.css"]
})
export class BottombarComponent implements OnInit {
  // var to store layout and component hide and show status
  bottomLayout: Object = {
    show: false
  };
  layoutToggle: Object = {
    bottomShow: true
  };
  selectedFile: File;
  selectedFileUrl;
  executiveSummary;
  fileLabel: string;
  activeParams;
  enableUpload = false;
  windowloader: Object = {
    name: "",
    loader: false
  };


  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.fileLabel = "Select Report Cover Image";
    this.activeRouteUpdate();
  }

  ngOnInit() {
   
  }

  activeRouteUpdate() {
    // watch router and update modal
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.activeParams = { ...params["params"] };
    });
  }

  onFileChanged(event) {
    this.windowloader = {
      name: "Cover Image in Uploading..",
      loader: true
    };

    this.selectedFile = event.target.files[0];
    this.fileLabel = this.selectedFile.name;
    console.log("Selected File " + this.selectedFile.name);
    const formData = new FormData();
    formData.append("file", this.selectedFile, "file");
    this.apiService._post("upload-file", formData).subscribe(
      response => {
        this.windowloader["loader"]=false;
        this.enableUpload = true;
        this.selectedFileUrl = response.data[0].url;
        console.log(response.data[0].url);
      },
      err => {
        this.windowloader["loader"]=false;
        console.log(err);
      }
    );
  }

  convQP2Obj(qp) {
    // split by &
    if (qp) {
      let qpArr = qp.split("&");
      let qpObj = {};
      for (let i = 0; i < qpArr.length; i++) {
        if (qpArr[i]) {
          let _qpObjArr = qpArr[i].split("=");
          qpObj[_qpObjArr[0]] = _qpObjArr[1].replace(/%20/gi, " ");
        }
      }

      return qpObj;
    }
  }

 
}
