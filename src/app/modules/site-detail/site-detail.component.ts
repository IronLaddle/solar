import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SitesModel } from 'src/app/model/SitesModel';
import * as URLConstant from '../../../app/constant/URLConstant';
import { DatePipe } from '@angular/common';
import { ProfileModel } from 'src/app/model/ProfileModel';
import { FormGroup, FormControl } from '@angular/forms';
import { FileDtlsModel } from 'src/app/model/FileDtlsModel';
import { AnnotationModel } from 'src/app/model/AnnotationModel';
import { AnomalyTypeModel } from 'src/app/model/AnomalyTypeModel';
import * as L from 'leaflet';
import { latLng, LatLng, tileLayer, circle, polygon, LatLngBoundsExpression, LatLngTuple, icon } from 'leaflet';

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.css']
})
export class SiteDetailComponent implements OnInit {

  siteId :number;
  siteDtl = new SitesModel();
  profId : number;
  profile_name : string;
  profile : ProfileModel;
  irFolder : string[] = [];
  irFileDtls : FileDtlsModel[];
  annotation : AnnotationModel[];
  anomalyType : AnomalyTypeModel;

  //ir images
  moduleIRShow: Boolean = false;
  anomaliesIRShow : Boolean = false;
  irImageBig : string;
  irImageActv: Boolean = false;

  //ortho
  moduleOrthoShow : Boolean = false;
  moduleTabOrthoShow : Boolean = false;

  //form
  irForm: FormGroup;
  orthoForm: FormGroup;
  reportForm: FormGroup;

  // leaftlet
  drawControl: L.Control.Draw;

  constructor(
    private apiService: ApiService, 
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private toastr : ToastrService,
    public datepipe : DatePipe
  ) { 

    this.irForm = new FormGroup({
      irAnomaliesType : new FormControl(null), 
      irSeverityType : new FormControl(null), 
    });

    this.orthoForm = new FormGroup({
      orthoAnomaliesType : new FormControl(null), 
      orthoSeverityType : new FormControl(null), 
    });

    this.reportForm = new FormGroup({
      rptDate : new FormControl(null), 
      rptCoordinat : new FormControl(null), 
      rptPanel : new FormControl(null), 
    });

  }

  ngOnInit(): void {
    this.siteId = this.activatedRoute.queryParams["_value"].site_id;
    this.toastr.info("Site ID : "+this.siteId);
    this.siteDetails();
    this.getFolder();
    this.annotationList();
  }

  siteDetails(){
    this.apiService._get(URLConstant.SITES + '/'+ this.siteId).subscribe(response => {
      if(response.data != null){
          let sd = new Date(response.data.started_at).toISOString();
          response.data.started_at = this.datepipe.transform(sd,'dd/MM/yyyy');
          response.data.start_date = sd;

          let up = new Date(response.data.updated_at).toISOString();
          response.data.updated_at = this.datepipe.transform(up,'dd/MM/yyyy');
          response.data.update_date = up;
        this.siteDtl = response.data;
          this.apiService._get(URLConstant.PROFILES + '/'+ this.siteDtl.profile_id).subscribe(resp => {
            this.profile = resp.data;
            this.profile_name = this.profile.name;
          })
      }
    })
  }

  getFolder(){
    this.apiService._get(URLConstant.FOLDERS).subscribe(response => {
      response.data.forEach(element => {
        this.irFolder.push(element);
      });
    })
  }

  goFolderDtls(folder : string){
    this.apiService._get(URLConstant.SITES +"/"+this.siteId+"/raw_images?folder="+folder).subscribe(response => {
      this.irFileDtls = response.data;
    })
  }

  getIrImages(path : string){
    if(path != null){
      this.irImageActv = true;
      this.irImageBig = path;
      console.info(path);
    }
  }

  annotationList(){
    this.apiService._get(URLConstant.SITES + "/"+ this.siteId + "/annotations").subscribe(resp => {
      this.annotation = resp.data;
      for(let zxc of this.annotation){
        let qwe = new Date(zxc.created_at).toISOString();
        zxc.created_at = this.datepipe.transform(qwe,'dd/MM/yyyy');

        if(zxc.anomaly_type_id == 1){
          zxc.anomaly_type = "Cell";
        }else if(zxc.anomaly_type_id == 2){
          zxc.anomaly_type = "Multi-Cell";
        }else if(zxc.anomaly_type_id == 3){
          zxc.anomaly_type = "Module";
        }else {
          zxc.anomaly_type = "String";
        }

        //too many request
        // this.apiService._get(URLConstant.ANOMALY_TYPES).subscribe(resp => {
        //   this.anomalyType = resp.data;
        //   if(zxc.anomaly_type_id == this.anomalyType.id){
        //     zxc.anomaly_type = this.anomalyType.name;
        //   }
        // })
      }
    })
  }



  toggleIRModule(){
    this.moduleIRShow = true;
  }

  toggleAnnotation(){
    this.anomaliesIRShow = true;
  }

  toggleOrthoModule(){
    this.moduleOrthoShow = true;
  }

  toggleOrthoAnnotation(){
    this.moduleTabOrthoShow = true;
  }

  // leaflet
  title = 'leaflet-angular';
	currentZoom = 7;
	currentCenter = new LatLng(2.901275, 101.651944);
	currentBounds:LatLngBoundsExpression = [[2.900169, 101.650864],[2.902380, 101.653024]];

	currentLat = this.currentCenter.lat;
	currentLng = this.currentCenter.lng;

	osmLayerUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	
	leaftletOptions = {
		layers: [ 
		L.tileLayer(this.osmLayerUrl, { attribution: "Open Street Map" }),
		 ],
		zoom: this.currentZoom,
		center: this.currentCenter,
		detectRetina: true,
		maxZoom: 23,
		minZoom: 13
  };
  
  layersControl = {
		baseLayers: {
			'RGB' : tileLayer('https://aerodyne-solar.s3.us-east-2.amazonaws.com/Maptiler+200ft/{z}/{x}/{y}.png',{
				minZoom: 10,
				maxNativeZoom: 22,
				maxZoom: 23,
				noWrap: true,
				bounds: this.currentBounds,
				attribution: '<div id="credits" style="display:inline">Aerodyne Campus, Cyberjaya, Selangor, Malaysia. | Aerial Imagery &copy; Aerodyne | Made By Aerodyne </div>'
			}),
			'Thermal' : tileLayer('https://aerodyne-solar.s3.us-east-2.amazonaws.com/maptiler+thermal/{z}/{x}/{y}.png',{
				minZoom: 10,
				maxNativeZoom: 22,
				maxZoom: 23,
				noWrap: true,
				bounds: this.currentBounds,
				attribution: '<div id="credits" style="display:inline">Aerodyne Campus, Cyberjaya, Selangor, Malaysia. | Aerial Imagery &copy; Aerodyne | Made By Aerodyne </div>'
			})
		}
	};

	drawOptions = {
		position: 'topleft',
		draw: {
			marker: {
				icon: icon({
					iconSize: [ 32, 40 ],
					iconAnchor: [ 16, 40 ],
					iconUrl: 'assets/image/map-marker-icon-green@2x.png'
				})
			},
			rectangle: { showArea: false }, // disable showArea
			polyline: true,
			circle: false,
		}
  };
  
  onCenterChange(center: LatLng) {
		setTimeout(() => {
			this.currentLat = this.currentCenter.lat;
			this.currentLng = this.currentCenter.lng;
		});
	}

	onZoomChange(zoom: number) {
		setTimeout(() => {
			this.currentZoom = zoom;
			console.info("Current Zoom: ", this.currentZoom);
		});
  }
  
  onDrawCreated (e) {
		console.info("draw type: " + e.layerType);
		console.info("draw layer: " + e.layer);
	}

	onMapReady(map: L.Map) {
		map.on(L.Draw.Event.CREATED, function (e) {
			// const type = (e as L.DrawEvents.Created).layerType,
			// layer = (e as L.DrawEvents.Created).layer;
			const type = (e as any).layerType,
				  layer = (e as any).layer

			if (type === 'polygon') {
				const polygonCoordinates = layer._latlngs;
				console.info(polygonCoordinates);
			}
			if (type === 'rectangle') {
				const rectangleCoordinates = layer._latlngs;
				console.info(JSON.stringify(rectangleCoordinates));
			}
			if (type === 'polyline') {
				const polylineCoordinates = layer._latlngs;
				console.info(polylineCoordinates);
			}
		});
	}

  


}
