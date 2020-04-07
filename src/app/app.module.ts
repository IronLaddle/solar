import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx 
import { ToastrModule } from 'ngx-toastr';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { UiScrollModule } from 'ngx-ui-scroll';
import { 
  faCoffee,faSearch,faCaretDown,faDownload,faEdit,faCheck,faCogs
} from '@fortawesome/free-solid-svg-icons';

// modules
import { HomeComponent } from './modules/home/home.component';
import { SiteComponent } from './modules/site/site.component';
import { SiteDetailComponent } from './modules/site-detail/site-detail.component';
import { NewprojectComponent } from './modules/newproject/newproject.component';
import { UserMgmntComponent } from './modules/user-mgmnt/user-mgmnt.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { HttpTokenInterceptor } from './core';
import { HeaderComponent } from './shared/layout';
import { BreadcrumbComponent } from './shared/components';
import { DatePipe } from '@angular/common';

//leaflet
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { TestmapComponent } from './modules/testmap/testmap.component';
import { MinimapComponent } from './modules/minimap/minimap.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SiteComponent,
    NewprojectComponent,
    UserMgmntComponent,
    HeaderComponent,
    SiteDetailComponent,
    BreadcrumbComponent,
    TestmapComponent,
    MinimapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TypeaheadModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    NgxExtendedPdfViewerModule,
    FontAwesomeModule,
    UiScrollModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpTokenInterceptor,
    multi: true,
  },
  DatePipe
],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faCoffee,faSearch,faCaretDown,faDownload,faEdit,faCheck,faCogs);
  }
 }
