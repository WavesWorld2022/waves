import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {AboutUsComponent} from "./components/about-us/about-us.component";
import {ExploreComponent} from "./components/explore/explore.component";
import {CompareComponent} from "./components/compare/compare.component";
import {ManufacturesComponent} from "./components/manufactures/manufactures.component";
import {TechnologiesComponent} from "./components/technologies/technologies.component";
import {ProductsComponent} from "./components/products/products.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: "full"},
  {path: 'home', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'explore', component: ExploreComponent},
  {path: 'compare', component: CompareComponent},
  {path: 'manufactures', component: ManufacturesComponent},
  {path: 'technologies', component: TechnologiesComponent},
  {path: 'products', component: ProductsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
