import {Component, OnInit} from '@angular/core';
import {data} from "../assets/json/data";
import {waveLocations} from "../assets/json/markers";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vawes';

  ngOnInit() {
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
