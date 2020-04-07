import { Component, OnInit } from '@angular/core';
import { tileLayer, marker, icon, latLng } from 'leaflet';
import { SitesModel } from 'src/app/model/SitesModel';
import { Router } from '@angular/router';
import * as URLConstant from '../../../app/constant/URLConstant';
import { ApiService } from 'src/app/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.css']
})
export class MinimapComponent implements OnInit {

  sites : SitesModel[];


  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {

   }

   // Open Street Map Definition
	LAYER_OSM = {
		id: 'openstreetmap',
		name: 'Open Street Map',
		enabled: false,
		layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Open Street Map'
    })
  };

  ngOnInit() {
		this.generateData();
  }
  
  // Values to bind to Leaflet Directive
	layersControlOptions = { position: 'bottomright' };
	baseLayers = {
		'Open Street Map': this.LAYER_OSM.layer
	};
	options = {
		zoom: 5,
		center: L.latLng([ 36.1106264, -104.4736583 ])
	};

	// Marker cluster stuff
	// markerClusterGroup: L.MarkerClusterGroup;
	// markerClusterData: L.Marker[] = [];
	// markerClusterOptions: L.MarkerClusterGroupOptions;


	// markerClusterReady(group: L.MarkerClusterGroup) {
	// 	this.markerClusterGroup = group;
	// }

	generateData() {
    const data: L.Marker[] = [];
    this.apiService._get(URLConstant.SITES).subscribe(response => {
      this.sites = response.data;

      for (let i = 0; i < this.sites.length; i++) {
        const icon = L.icon({
          iconUrl: 'assets/image/map-marker-icon-green@2x.png',
          iconSize: [ 32, 41 ],
          iconAnchor: [ 16, 40 ],
        });
        data.push(L.marker([ this.sites[i].longitude, this.sites[i].latitude ], { icon }));
      }
    })
		return data;
	}
  


 
}
