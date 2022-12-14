import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {environment} from "../environments/environment.prod";
import {HeaderComponent} from './components/core/header/header.component';
import {FooterComponent} from './components/core/footer/footer.component';
import {HomeComponent} from './components/home/home.component';
import {AboutUsComponent} from './components/about-us/about-us.component';
import {ExploreComponent} from './components/explore/explore.component';
import {CompareComponent} from './components/compare/compare.component';
import {ManufacturesComponent} from './components/manufactures/manufactures.component';
import {TechnologiesComponent} from './components/technologies/technologies.component';
import {ProductsComponent} from './components/products/products.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {ContactComponent} from './components/contact/contact.component';
import {MagazineComponent} from './components/magazine/magazine.component';
import {LoaderComponent} from './components/core/loader/loader.component'
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LocationComponent} from './components/location/location.component';
import {SafePipeModule} from 'safe-pipe';
import {ManufacturesItemComponent} from './components/manufactures/manufactures-item/manufactures-item.component';
import { TechnologiesItemComponent } from './components/technologies/technologies-item/technologies-item.component';
import { ProductsItemComponent } from './components/products/products-item/products-item.component';
import {ModalModule} from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    ExploreComponent,
    CompareComponent,
    ManufacturesComponent,
    TechnologiesComponent,
    ProductsComponent,
    ContactComponent,
    MagazineComponent,
    LoaderComponent,
    LocationComponent,
    ManufacturesItemComponent,
    TechnologiesItemComponent,
    ProductsItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    TypeaheadModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SafePipeModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
