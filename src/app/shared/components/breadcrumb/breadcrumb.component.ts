import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb = [];

  // breadcrumb object hold label and nav link
  port: Object = { port_name: '', port_id: '', port_nav: '' };
  site: Object = { site_name: '', site_id: '', site_nav: '' };
  asset: Object = { asset_name: '', asset_id: '', asset_nav: '' };

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {

    // breadcrumb update on window reload
    this.breadcrumb = this.creatBreadcrumb(this.router.url);
  }

  ngOnInit() {
    // breadcrumb update on url update
    this.router.events.subscribe(async e => {

      if (e instanceof NavigationEnd) {
        this.breadcrumb = await this.creatBreadcrumb(e.urlAfterRedirects);
      }
    })
  }

  creatBreadcrumb(url) {

    // split url and queryParamas
    let data = url.split("?");
    let _url = data[0];
    let _qParams = data[1];

    let _urlArr = _url.split("/");
    let _qParamsObj = {};

    let breacrumb: Array<Breadcrumb> = [];
    if (_qParams && _qParams.length > 0) {
      _qParamsObj = this.convQP2Obj(_qParams);
    }

    if (_urlArr.length > 1) {
      for (let i = 1; i < _urlArr.length; i++) {
        const bc = this.getNameAndPath(_urlArr[i], _qParamsObj);
        breacrumb.push(bc);
      }
    } else {
      breacrumb.push({ name: 'home', path: '/home' });
    }

    return breacrumb;
  }

  // converte qp string to object
  convQP2Obj(qp) {
    // split by &
    if (qp){
    let qpArr = qp.split("&");
    let qpObj = {};

    for (let i = 0; i < qpArr.length; i++) {
      if (qpArr[i]) {
        let _qpObjArr = qpArr[i].split("=");
        qpObj[_qpObjArr[0]] = (_qpObjArr[1]).replace(/%20/gi, " ");
      }
    }
    return qpObj;
  }

  }

  // get name and path
  getNameAndPath(type: string, qp: object): Breadcrumb {
    console.warn(type)
    let returnData = {
      name: '',
      path: ''
    };

    // home
    if (type == 'home') {
      returnData['name'] = 'home';
      returnData['path'] = '/home';
    }

    if (type == 'newproject') {
      returnData['name'] = 'newproject';
      returnData['path'] = '/home/newproject';
    }

    if (type == 'site') {
      returnData['name'] = 'site';
      returnData['path'] = '/home/site';
    }

    if (type == 'site-detail') {
      returnData['name'] = 'site-detail';
      returnData['path'] = `/home/site/site-detail?site_name=${qp['site_name']}&site_id=${qp['site_id']}`;
    }

    return returnData;
  }

}
