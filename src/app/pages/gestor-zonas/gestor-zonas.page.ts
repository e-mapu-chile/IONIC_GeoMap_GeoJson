import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { antPath } from 'leaflet-ant-path';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CheckboxCustomEvent, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-gestor-zonas',
  templateUrl: './gestor-zonas.page.html',
  styleUrls: ['./gestor-zonas.page.scss'],
})
export class GestorZonasPage  {
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
    await this.leafletMap(-23.407377534587543, -67.96089334899497, 5);
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

    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'SAG',
      // subdomains: 'abcd',
      // minZoom: 0,
      // maxZoom: 18,
      // ext: 'png'
    }).addTo(this.map);

    this.map.on('moveend', function (e) {

      const { lat, lng: lon } = e.target.getCenter();
      const zoom = e.target.getZoom();
      //alert(lat)
      //      console.log("Lat, Lon : " + e.target + ", " + e.target.latlng)
      this.objtCoordenada = {
        lat: lat,
        long: lon,
        zoom: zoom
      }
      Preferences.set({
        key: 'geo',
        value: JSON.stringify(this.objtCoordenada)
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
