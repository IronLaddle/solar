import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SitesModel } from 'src/app/model/SitesModel';
import { ApiService } from 'src/app/core';
import * as URLConstant from '../../../app/constant/URLConstant';
import { DatePipe } from '@angular/common';
import { tileLayer, marker, icon, latLng, Layer } from 'leaflet';
import { responsivePopup } from 'leaflet-responsive-popup';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

  siteAll : SitesModel[];
  modifiedData : any;

  siteHeader: string[] = [];
  searchText : string = '';

  markers: Layer[] = [];
     
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService,
    public datepipe : DatePipe
  ) { 
    
  }

  ngOnInit(): void {
    this.viewSite();
  }

  createProject(){
    this.router.navigate(['home/newproject']);
  }

  goSite(site){
    this.router.navigate(['home/site/site-detail'], { queryParams: {site_id: site.id } })
  }

  viewSite(){
    this.apiService._get(URLConstant.SITES).subscribe(response => {
      if(response.data != null){
        response.data.forEach(element => {
          let sd = new Date(element.started_at).toISOString();
          element.started_at = this.datepipe.transform(sd,'dd/MM/yyyy');
          element.start_date = sd;

          let up = new Date(element.updated_at).toISOString();
          element.updated_at = this.datepipe.transform(up,'dd/MM/yyyy');
          element.update_date = up;
        });
        this.siteAll = response.data;
        this.modifiedData = this.siteAll;

        for (let qwe of this.siteAll){
          this.siteHeader.push(qwe.name);
        }

        for (let i = 0; i < this.siteAll.length; i++) {
          const newMarker = marker(
            [ this.siteAll[i].latitude, this.siteAll[i].longitude ],
            {
              icon: icon({
                iconSize: [ 32, 41 ],
                iconAnchor: [ 16, 40 ],
                iconUrl: 'assets/image/map-marker-icon-green@2x.png'
              })
            }
          ).on('click', () => {
            
          }).bindPopup(responsivePopup().setContent(this.getText(this.siteAll[i])));
          this.markers.push(newMarker);
        }
        
      }
    })
  }


searchSite(name: string) {  
  this.siteAll;
    if(name == null || name == ''){
      this.apiService._get(URLConstant.SITES).subscribe(response => {
        if(response.data != null){
          response.data.forEach(element => {
            let sd = new Date(element.started_at).toISOString();
            element.started_at = this.datepipe.transform(sd,'dd/MM/yyyy');
            element.start_date = sd;
  
            let up = new Date(element.updated_at).toISOString();
            element.updated_at = this.datepipe.transform(up,'dd/MM/yyyy');
            element.update_date = up;
          });
          this.siteAll = response.data;
        }
      })
      return this.siteAll;
    }else {
      this.siteAll = this.modifiedData.filter(searchSite => searchSite.name == name); 
    } 
    return this.siteAll;
   }    


   streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
    }
  };

   options = {
    layers: [ this.streetMaps ],
    zoom: 5,
    center: latLng([ 36.1106264, -104.4736583 ]),
    detectRetina: true
  };

  getText(site:SitesModel){
    var contentString = `
        <div class="container-fluid">
         <div class="row">
            <div class="col-6">
              <span style="font-size:14px;"><b>${site.name}</b></span>
              
            </div>
            <div class="col-6">
              <img src="../../../../../assets/image/mw-icon-yellow.svg" style="width:12px;">
              <span style="font-size:14px;"><b>${site.total_mw}</b></span><span style="font-size:10px;">MW</span>
            </div>
         </div>
         <p style="font-size:10px;color:grey;">In progress</p>
         <div class="row">
            <div class="col-6">
              <span style="font-size:10px">START DATE</span>
              <p style="font-size:10px">${site.started_at}</p>
            </div>
            <div class="col-6">
              <span style="font-size:10px;">ANOMALIES</span>
              <p style="font-size:10px">55</p>
            </div>
         </div>
         <div class="row">
            <div class="col-6">
              <span style="font-size:10px">LAST MODIFIED</span>
              <p style="font-size:10px">${site.updated_at}</p>
            </div>
            <div class="col-6">
              <span style="font-size:10px;">SEVERITY LEVEL</span>
              <p style="font-size:10px;color:green;">Low</p>
            </div>
         </div>
         <div style="text-align:center;">
              <button class="btn btn-sm" style="font-size:10px;background:#3f3f3f;color:white" (click)="goSite(${site.id})">Enter Site</button>
        </div>
        </div>
        `;
        return contentString;
  }

}
