import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { antPath } from 'leaflet-ant-path';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CheckboxCustomEvent, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ingreso-mortalidad',
  templateUrl: './ingreso-mortalidad.page.html',
  styleUrls: ['./ingreso-mortalidad.page.scss'],
})
export class IngresoMortalidadPage {
  map: Leaflet.Map;
  presentingElement = null;
  dataConf: any;
  constructor() { }

  ngOnInit() {
  }

  async ionViewDidEnter() {

    //this.ajusteMapaSize();
    //this.getDataSets();
    await Preferences.remove({ key: 'geo' });
    await this.leafletMap(-23.407377534587543, -67.96089334899497, 6);
    this.presentingElement = document.querySelector('.ion-page');

    // const dataJ = await this.storage.get('prediccionRiesgo')
    // this.jsonConcat = dataJ || [];
    // if (this.jsonConcat.length > 0) {
    //   this.jsonMapa();
    // }

    const { value } = await Preferences.get({ key: 'configuracion' });
    var dataOf = JSON.parse(value);
    this.dataConf = dataOf || undefined;

  }

  lats: number = 0;
  longt: number = 0;
  async leafletMap(lat, long, zoom) {

    this.map = new Leaflet.Map('mapId5').setView([lat, long], zoom);

    // Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //   attribution: 'SAG',
    //   // subdomains: 'abcd',
    //   // minZoom: 0,
    //   // maxZoom: 18,
    //   // ext: 'png'
    // }).addTo(this.map);
    Leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(this.map);

    this.map.on('moveend', function (e) {

    });
   
    this.map.on('click', function (e) {
      console.log("Lat, Lon : " + e.latlng)
      const markPoint = Leaflet.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      markPoint.bindPopup('<p>RUP: da</p>', {
        closeButton: false
      }).on("popupopen", (a) => {
       
      });
  
      

    });
    
    var legend = Leaflet.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      // var div = Leaflet.DomUtil.create('div', 'info legend');
      // div.innerHTML = '<img alt="legend" src="../assets/img/Legend.png" width="140" height="300" />'
      // return div;
    };
    legend.addTo(this.map);

   
  }

  

}
