import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'solar-frontend';
  isLogged: Boolean;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.info(event.url);
        if (event.url.includes('/auth/login')) {
          let url = event.url.split('?');
          this.isLogged = (url[0].includes('/auth')) ? false: true;
        } else if(event.url.includes('/')) {
          this.isLogged = false;
        } else {
          this.isLogged = true;
        }
      }
    })
  }

  ngOnInit() {

  }
  
}
