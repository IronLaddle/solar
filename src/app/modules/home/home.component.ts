import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, UserService } from 'src/app/core';
import { AssetModel } from 'src/app/model/AssetModel';
import * as URLConstant from '../../../app/constant/URLConstant';
import { SitesModel } from 'src/app/model/SitesModel';
import { DefectSeverityModel } from 'src/app/model/DefectSeverity';
import { SeverityModel } from 'src/app/model/SeverityModel';
import { tileLayer, latLng, marker, icon, Layer } from 'leaflet';
import { responsivePopup } from 'leaflet-responsive-popup';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userDetails: Object;
  hamburgerStatus = false;
  showSideBar: Boolean = true;
  defectDtl = new DefectSeverityModel();
  defectSev : DefectSeverityModel[];
  assetOvw : AssetModel;
  sites : SitesModel[];
  sitesName : string[];

  selected: string;
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Wisconsin',
    'Wyoming'
  ];

  markers: Layer[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private apiService: ApiService,
    public datepipe : DatePipe
  ) {
    this.userDetails = this.userService.getSession();
    this.defectDtl.severity = new SeverityModel();
   }

  ngOnInit(): void {
    this.assetDetails();
    this.allSite();
    //this.defectSeverity();
    this.allSiteDefect();
  }


  toggleSideBar(){
    this.showSideBar = !this.showSideBar;
  }

  allSiteDefect(){
    this.apiService._get(URLConstant.DEFECT_SEVERITY).subscribe(response => {
      this.defectSev = response.data;
      //console.info(this.defectDtl[0].severity.High)
    })
  }

  getProgressvalue() {
    return this.defectDtl.severity;
  }

  assetDetails(){
    this.apiService._get(URLConstant.OVERVIEW).subscribe(response => {
      this.assetOvw = response.data;
    })
  }

  

  allSite(){
    this.apiService._get(URLConstant.SITES).subscribe(response => {
      response.data.forEach(element => {
        let sd = new Date(element.started_at).toISOString();
        element.started_at = this.datepipe.transform(sd,'dd/MM/yyyy');
        element.start_date = sd;

        let up = new Date(element.updated_at).toISOString();
        element.updated_at = this.datepipe.transform(up,'dd/MM/yyyy');
        element.update_date = up;
        this.sitesName = element.name;
      });
        this.sites = response.data;

      for (let i = 0; i < this.sites.length; i++) {
        const newMarker = marker(
          [ this.sites[i].latitude, this.sites[i].longitude ],
          {
            icon: icon({
              iconSize: [ 32, 41 ],
              iconAnchor: [ 16, 40 ],
              iconUrl: 'assets/image/map-marker-icon-green@2x.png'
            })
          }
        ).on('click', () => {
          
        }).bindPopup(responsivePopup().setContent(this.getText(this.sites[i])));
        this.markers.push(newMarker);
      }
    })
  }

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
        </div>
        `;
        return contentString;
  }

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
    },
    // overlays: {
    //   'Chicago': this.chicago,
    //   'Utah': this.utah,
    //   'Nevada':this.nevada,
    //   'Florida':this.florida,
    //   'Arkansas':this.arkansas,
    //   'Alabama':this.alabama,
    //   'New Jersey':this.new_jersey,
    //   'South Carolina':this.south_carolina,
    //   'Maine':this.maine,
    //   'Pennsylvania':this.pennsylvania,
    // }
  };

  
   //set initial set of displayed layers
   options = {
    layers: [ this.streetMaps ],
    zoom: 5,
    center: latLng([ 36.1106264, -104.4736583 ]),
    detectRetina: true
  };

  goSite(siteId:number){
    console.info(siteId);
  }


}
