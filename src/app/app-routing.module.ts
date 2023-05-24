import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AboutUsComponent} from './components/about-us/about-us.component';
import {ExploreComponent} from './components/explore/explore.component';
import {CompareComponent} from './components/compare/compare.component';
import {ManufacturesComponent} from './components/manufactures/manufactures.component';
import {TechnologiesComponent} from './components/technologies/technologies.component';
import {ProductsComponent} from './components/products/products.component';
import {ContactComponent} from './components/contact/contact.component';
import {MagazineComponent} from './components/magazine/magazine.component';
import {LocationComponent} from './components/location/location.component';
import {ManufacturesItemComponent} from './components/manufactures/manufactures-item/manufactures-item.component';
import {TechnologiesItemComponent} from "./components/technologies/technologies-item/technologies-item.component";
import {ProductsItemComponent} from "./components/products/products-item/products-item.component";
import {TermsOfUseComponent} from "./components/terms-of-use/terms-of-use.component";
import {PrivacyPolicyComponent} from "./components/privacy-policy/privacy-policy.component";
import {FaqComponent} from "./components/faq/faq.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'explore', component: ExploreComponent},
  {path: 'compare', component: CompareComponent},
  {path: 'manufactures', children: [
      {path: '', component: ManufacturesComponent},
      {path: ':id', component: ManufacturesItemComponent},
    ]},
  {path: 'technologies', children: [
      {path: '', component: TechnologiesComponent},
      {path: ':id', component: TechnologiesItemComponent}
    ]},
  {path: 'products', children: [
      {path: '', component: ProductsComponent},
      {path: ':id', component: ProductsItemComponent}
    ]},
  {path: 'contact', component: ContactComponent},
  {path: 'magazine', component: MagazineComponent},
  {path: 'location', children: [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: ':id', component: LocationComponent},
  ]},
  {path: 'terms-of-use', component: TermsOfUseComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'faq', component: FaqComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

