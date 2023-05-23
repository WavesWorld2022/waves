import {Component, OnInit} from '@angular/core';
import {FireService} from "./services/fire.service";
import {waveSpecifications} from "../assets/json/wave-specifications";
// @ts-ignore
import {locations} from "../assets/json/old/locations";
import {IWaveLocation, IWaveSpecification} from "./shared/models";
import {data} from "../assets/json/old/data";
import {_products} from "../assets/json/old/_products";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'waves';

  constructor(private fireService: FireService) { }


  ngOnInit() {

    /*const z: any = JSON.parse(JSON.stringify(waveSpecifications))
    z.forEach((ws: any) => {
      const waves = locations.find((l: any) => l.id === ws.waveSpecificationLocation)!.waves
      ws.waveSpecificationWaveSystem = Object.values(waves).find(w => w.wave_name === ws.waveSpecificationName).wave_system;
    })
    console.log(z)*/

    /*const ns: any = [];
    locations.filter(l => l.nearby_natural_spots && Array.isArray(l.nearby_natural_spots) && l.nearby_natural_spots.length > 0)
      .forEach(lo => {
        lo.nearby_natural_spots.forEach(asd => {
          ns.push({
            nearbyNaturalSpotName: asd.name,
            nearbyNaturalSpotLocation: lo.id,
            nearbyNaturalSpotAddress: asd.address
          })
        })
      })
    console.log(ns)*/

    // this.fireService.upload(productionMethod, 'production-methods')
    /*const a: any[] = [];
    const locations: any[] = [];

    data.forEach(i => {
      if(i.key === "slogan") { a.push(i.id) }
    });

    let locId = [... new Set(a)];
    locId.forEach(id => {
      const tempObject: any = { id: id }
      const locData = data.filter(i => i.id === id);
      locData.forEach((p: any) => {
        tempObject[p.key] = p.value
      })
      locations.push(tempObject)
    })
    console.log(locations[0])
*/

    // this.downloadJson(locations)

   /* const loc: any = [];

    locations.forEach((l: any) => {
      const w0: any = {};
      const w1: any = {};
      const w2: any = {};
      const w3: any = {};
      const w4: any = {};
      const w5: any = {};
      const w6: any = {};
      const w7: any = {};

      const WS = [w0, w1, w2, w3, w4, w5, w6, w7];


      const n0: any = {};
      const n1: any = {};
      const n2: any = {};

      const N = [n0, n1, n2];

      Object.keys(l).forEach((k: any) => {
        for(let i = 0; i < 8; i++) {
          if(k.includes('wave_specifications_' + [i] + '_')){
            const newKey = k.replace('wave_specifications_' + [i] + '_', '');
            if(i === 0) w0[newKey] = l[k];
            if(i === 1) w1[newKey] = l[k];
            if(i === 2) w2[newKey] = l[k];
            if(i === 3) w3[newKey] = l[k];
            if(i === 4) w4[newKey] = l[k];
            if(i === 5) w5[newKey] = l[k];
            if(i === 6) w6[newKey] = l[k];
            if(i === 7) w7[newKey] = l[k];
          }
        }
      })

      Object.keys(l).forEach((k: any) => {
        for(let i = 0; i < 3; i++) {
          if(k.includes('nearby_natural_wave_spots_' + [i] + '_natural_spot_')){
            const newKey = k.replace('nearby_natural_wave_spots_' + [i] + '_natural_spot_', '');
            if(i === 0) n0[newKey] = l[k];
            if(i === 1) n1[newKey] = l[k];
            if(i === 2) n2[newKey] = l[k];
          }
        }
      })

      const waves = JSON.parse(JSON.stringify(WS.filter((w: any) => Object.keys(w).length > 0)));
      const near = JSON.parse(JSON.stringify(N.filter((w: any) => Object.keys(w).length > 0)));

      Object.keys(l).forEach((k: any) => {
        for(let i = 0; i < 8; i++) {
          if(k.includes('wave_specifications_' + [i] + '_')){
            delete l[k]
          }
        }
      })

      Object.keys(l).forEach((k: any) => {
        for(let i = 0; i < 8; i++) {
          if(k.includes('nearby_natural_wave_spots_' + [i] + '_natural_spot_')){
            delete l[k]
          }
        }
      })

      l.waves = waves;
      l.nearby_natural_spots = near;
      loc.push(l)

    })

    this.downloadJson(loc)*/

  }

  downloadJson(myJson: any){
    var sJson = JSON.stringify(myJson);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', "primer-server-task.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }
}
