import { Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
import { Storage } from '@ionic/storage';
import 'leaflet-routing-machine';
import { Preferences } from '@capacitor/preferences';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const myLines = [{
  "type": "Polygon",
  "coordinates": [[
    [105.02517700195314, 19.433801201715198],
    [106.23367309570314, 18.852796311610007],
    [105.61843872070314, 7.768472031139744]

  ]]
}, {
  "type": "LineString",
  "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];


//For geometry from data
const myStyle = {
  "color": "green",
  "weight": 5,
  "opacity": 0.65
};
const markerIcon = Leaflet.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  // specify the path here
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
});
Leaflet.Marker.prototype.options.icon = markerIcon;
@Component({
  selector: 'app-gestor-poligonos',
  templateUrl: './gestor-poligonos.page.html',
  styleUrls: ['./gestor-poligonos.page.scss'],
})
export class GestorPoligonosPage implements OnInit {
  @ViewChild(IonModal) modal2: IonModal;
  loading: HTMLIonLoadingElement;
  map: Leaflet.Map;
  presentingElement = null;
  dataConf: any;


  lat: number = 16.382889;
  lon: number = 107.402344;
  maker: Leaflet.Marker<any>;
  dbmaker: Leaflet.Marker<any>[];

  markers: any[];
  drawnItems: any;

  datachild: any;
  isAddFieldTask: boolean;
  isSave: boolean;

  tipoFigura = "";
  arrayPoligonoTemp = [];
  pointCirculo;
  radioCirculo: number;
  nombreZona = "";
  nombreLugar = "";
  nombreComuna = "";
  nombreUsuarioLogeado = "";
  markerList = [];
  semanasEpiLista: any = [];
  semanaSel = "";
  idZona = 0;
  estadoActualZona = 4;
  nombreZonaTool = "";
  nombreLugarTool = "";

  constructor(private storage: Storage,
    private http: HttpClient,
    public loadingController: LoadingController,
    private toastController: ToastController) { }

  ngOnInit() {
  }
  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
    });
    await toast.present();
  }
  cancel() {
    this.modal2.dismiss(null, 'cancel');
  }
  async confirm() {

    if (this.tipoFigura == "polygon") {
      //ES UN POLIGONO
      var cordina2 = []
      for await (const pol of this.arrayPoligonoTemp[0]) {
        console.log(pol)
        var ob = pol;
        console.log(ob.lat) //22.417009942
        var ojbR = [ob.lng, ob.lat];
        cordina2.push(ojbR);
      }

      var data = [{
        "type": "Polygon",
        "properties": {
          "name": this.nombreZona,
          "lugar": this.nombreLugar,
          "comuna": this.nombreComuna
        },

        "coordinates": [cordina2]
      }]
      console.log(JSON.stringify(data));
      this.setFiguraGeometrica('Polygon', '#ff7800', data)

    }
    if (this.tipoFigura == "circle") {
      //ES UN POLIGONO
      var ob1 = this.pointCirculo;
      var dataC = [ob1.lat, ob1.lng, this.radioCirculo]
      this.setFiguraGeometrica('circle', '#ff7800', dataC)
      // var data = [-21.929890377675722, -70.03944426224518],
      // {
      //   radius: 56371,
      //   fillColor: "#ff7800",
      //   color: "#000",
      //   weight: 1,
      //   opacity: 0.65

      // }
    }
    this.modal2.dismiss("this.name", 'confirm');


  }

  async ionViewDidEnter() {
    this.semanasEpiMortal();
    
    const nombreUsuario = await this.storage.get("nombreUsuario")
    this.nombreUsuarioLogeado = nombreUsuario;
    this.map = new Leaflet.map('mapId5').setView([-23.407377534587543, -67.96089334899497], 6);


    const baselayers = {
      "openstreetmap": Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      "googleStreets": Leaflet.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      "googleHybrid": Leaflet.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),

      "googleTerrain": Leaflet.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      //"VMap": Leaflet.tileLayer('https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=8fb3246c12d442525034be04bcd038f22e34571be4adbd4c'),

    };
    Leaflet.control.scale().addTo(this.map);
    var overlays = {};

    Leaflet.control.layers(baselayers, overlays).addTo(this.map);

    baselayers["googleTerrain"].addTo(this.map);




    this.drawnItems = new Leaflet.FeatureGroup();

    this.map.addLayer(this.drawnItems);


    var options = {
      position: 'topright',
      draw: {
        // polyline: {
        //     shapeOptions: {
        //         color: '#f357a1',
        //         weight: 10
        //     }
        // },
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>error!<strong> trata de intentarlo otra vez!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#bada55'

          },
          showArea: true,
          metric: false,
          feet: false

        },
        polyline: false,
        circle: true,
        marker: false,
        circlemarker: false,// Turns off this drawing tool
        // rectangle: {

        //   shapeOptions: {
        //     clickable: false
        //   }
        // },

        // marker:
        // {

        //   icon: markerIcon

        // }
      },
      edit: {
        featureGroup: this.drawnItems, //REQUIRED!!
        // remove: false
      }

    };

    var drawControl = new Leaflet.Control.Draw(options);
    this.map.addControl(drawControl);

    var app = this;

    this.map.on(Leaflet.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        layer.bindPopup('A popup!');
        console.log("POLIGONO MARKER");
        console.log(layer.getLatLng());
      }
      else {
        app.tipoFigura = type;
        if (type == "circle") {
          console.log("RADIO");
          console.log(layer._latlng);
          console.log(layer._mRadius);
          app.pointCirculo = layer._latlng;
          app.radioCirculo = layer._mRadius;
          app.modal2.present();
        } else {
          console.log("POLIGONO");
          console.log("type => " + type)

          app.arrayPoligonoTemp = layer.getLatLngs();
          app.modal2.present();
        }


      }

      app.drawnItems.addLayer(layer);


    });
    //PINTAR DESDE BD
    this.geometricaBD(app)
    this.mortalidades();
  }



  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      //this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  async geometricaBD(app) {
   
    const xL = await this.cargando("Espere, cargando zonas ");
    this.getZonas().subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);
      var myLines = [];
      var flag = 0;
      var arrCr = []
      dataJ.zonas.forEach(z => {
        //console.log(z.TipoGeometria)

        if (z.TipoGeometria == "Polygon") {
          var co = JSON.parse(z.JsonPoligono)
          // console.log(co);
          var data = {
            "type": "Polygon",
            "properties": {
              "id": z.Id,
              "name": z.NombreGeometria,
              "lugar": z.NombreLugar,
              "comuna": z.ComunaLugar,
              "vigente": z.Vigente
            },
            "coordinates": co[0].coordinates
          }
          // console.log(JSON.stringify(data))
          myLines.push(data);
        } else {
          if (z.TipoGeometria == "circle") {


            var htmls = "<p> Zona =  " + z.NombreGeometria + " </p>"
            htmls += "<p> Lugar = " + z.NombreLugar + "</p>"
            htmls += "<p> Comuna =  " + z.ComunaLugar + "</p>"
            console.log(JSON.parse(z.JsonCirculo))
            arrCr = JSON.parse(z.JsonCirculo);
            var color = "#ff7800"
            if (z.Vigente == 1) {
              //VIGENTE ZONA INFECTADA
              color = "#B40404";

            } else {
              //NO VIGENTE LIBRE
              color = "#0B610B";
            }
            Leaflet.circle([arrCr[0], arrCr[1]],
              {
                radius: arrCr[2],
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.2
              }).addTo(this.map)
              .bindPopup(htmls, { closeButton: false })
              .on("popupopen", (a) => {
                app.idZona = z.Id
                app.estadoActualZona = z.Vigente
                app.nombreZonaTool = z.NombreGeometria
                app.nombreLugarTool = z.NombreLugar
              });// ES AL REVES LATITUD LONGITUD CON RESPECTO AL POLIGONO
          }
        }

      });
      //console.log(JSON.stringify(myLines))
      Leaflet.geoJson(myLines, {

        onEachFeature: function (feature, layer) {

          var htmls = "<p> Zona =  " + feature.properties.name + "</p>"
          htmls += "<p> Lugar = " + feature.properties.lugar + "</p>"
          htmls += "<p> Comuna = " + feature.properties.comuna + "</p>"

          layer.bindPopup(htmls,
            { noHide: true, closeButton: false })
            .on("popupopen", (a) => {
              app.idZona = feature.properties.id
              app.estadoActualZona = feature.properties.vigente
              app.nombreZonaTool = feature.properties.name
              app.nombreLugarTool = feature.properties.lugar
            });;
          //IF SI ESTA ABIERTA O NO LA ZONA Y SE PONE EL COLOR
          var color2 = "#ff7800";
          if (feature.properties.vigente == 1) {
            //VIGENTE ZONA INFECTADA
            color2 = "#B40404";

          } else {
            //NO VIGENTE LIBRE
            color2 = "#0B610B";
          }
          layer.setStyle({
           // "fillColor": color2,
            "color": color2,
            "weight": 1,
            "opacity": 1,
            "fillOpacity": 0.2
          });
        }

      }).addTo(this.map);
      this.loading.dismiss();
    });
  }
  async leafletMap(lat, long, zoom) {

    this.map = new Leaflet.Map('mapId5', { drawControl: true }).setView([lat, long], zoom);

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


    var editableLayers = new Leaflet.FeatureGroup();
    this.map.addLayer(editableLayers);

    var options = {
      position: 'left',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#97009c'
          }
        },
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 10,
            //polyline: true,
          }
        },
        // disable toolbar item by setting it to false
        //: true,
        circle: true, // Turns off this drawing tool
        //  polygon: true,
        marker: true,
        rectangle: true,
      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: true
      }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new Leaflet.Control.Draw(options);
    this.map.addControl(drawControl);

    var editableLayers = new Leaflet.FeatureGroup();
    this.map.addLayer(editableLayers);

    this.map.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'polyline') {
        layer.bindPopup('A polyline!');
      } else if (type === 'polygon') {
        layer.bindPopup('A polygon!');
      } else if (type === 'marker') { layer.bindPopup('marker!'); }
      else if (type === 'circle') { layer.bindPopup('A circle!'); }
      else if (type === 'rectangle') { layer.bindPopup('A rectangle!'); }

      editableLayers.addLayer(layer);

    });

    legend.addTo(this.map);
  }
  async semanasEpiMortal() {
    (await this.getSemanasEpiMortal()).subscribe(async (resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API E= " + ss);
      const da = JSON.parse(ss);
      this.semanasEpiLista = da.semanasEpi;
      console.log(this.semanasEpiLista);
    });
  }

  async mortalidadEpi(item) {
    console.log(item)
    var semana;
    if (item.anio == 2022) {
      semana = item.D_2022

    }
    if (item.anio == 2023) {
      semana = item.D_2023
    }
    this.semanaSel = item.anio + "-" + semana
    for await (const iterator of this.markerList) {
      iterator.remove();
    }

    (await this.getMortalidadesSemanaEpi(item.anio, semana)).subscribe(async (resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API Epi= " + ss);
      const da = JSON.parse(ss);

      await this.pintarEventosServidor(da);
    });

  }
  async mortalidades() {
    (await this.getMortalidades()).subscribe(async (resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API E= " + ss);
      const da = JSON.parse(ss);

      await this.pintarEventosServidor(da);
    });
  }
  async quitarTodosPuntos() {
    for await (const iterator of this.markerList) {
      iterator.remove();
    }
    this.semanaSel = "";
  }
  async abrirZona(id) {
    console.log(id);
    await this.updateEstadoZona(id,0);
    window.location.reload();
  }
  async cerrarZona(id) {
    console.log(id);
    await this.updateEstadoZona(id,1);
    window.location.reload();
  }
  async pintarEventosServidor(jsonDa) {
    console.log("afaf => " +JSON.stringify(jsonDa))
    for await (const e of jsonDa.mortalidades) {
      var uno = Leaflet.icon({
        iconUrl: '../assets/img/base9.png',
        shadowUrl: '../assets/img/base9.png',
        iconSize: [5, 5], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
      });

      //console.log(e.latitud)
      const markPoint = new Leaflet.marker([parseFloat(e.Latitud), parseFloat(e.Longitud)], { icon: uno })
      this.markerList.push(markPoint);
      ///var fechaSpl = e.FechaEvento.toString().split('T');
      var htmls = '<p>Nombre Primer Punto: ' + e.Nombre + '</p>';
    //  htmls += '<p>Fecha Evento: ' + fechaSpl[0] + '</p>'
    //  htmls += '<p>Especie afectada: ' + e.Especie + '</p>'
    //  htmls += '<p>Cantidad: ' + e.Cantidad + '</p>'
    //  htmls += '<p>Observación: ' + e.Observacion + '</p>'
      markPoint.bindPopup(htmls, {
        closeButton: false
      }).on("popupopen", (a) => {



      });
      markPoint.addTo(this.map);

    }
  }

  async setFiguraGeometrica(tipoFigura, color, dataGeoJson) {
    //APLICAR LLAMADA POST
    var data;

    if (tipoFigura == "Polygon") {
      data = {
        tipoGeometria: tipoFigura,
        nombreGeometria: this.nombreZona,
        descrpcion: '',
        nombreLugar: this.nombreLugar,
        regionLugar: '',
        comunaLugar: this.nombreComuna,
        usuarioRegistro: this.nombreUsuarioLogeado,
        colorGeometria: color,
        estadoSanitario: '',
        jsonPoligono: JSON.stringify(dataGeoJson),
        jsonCirculo: '',
        jsonOtros: ''
      }
    } else {
      data = {
        tipoGeometria: tipoFigura,
        nombreGeometria: this.nombreZona,
        descrpcion: '',
        nombreLugar: this.nombreLugar,
        regionLugar: '',
        comunaLugar: this.nombreComuna,
        usuarioRegistro: this.nombreUsuarioLogeado,
        colorGeometria: color,
        estadoSanitario: '',
        jsonPoligono: '',
        jsonCirculo: JSON.stringify(dataGeoJson),
        jsonOtros: ''
      }
    }

    // const doJg = JSON.stringify(objEvento);
    // const data = { objEvento: doJg }
    const headers = new HttpHeaders().set("Authorization", '');
    return new Promise((resolve) => {
      this.http
        .post(
          'https://pssoft.cl/influenzaAviarrest/nuevaZona',
          data,
          { headers: headers }
        )
        .subscribe(
          (resp) => {
            let ss = JSON.stringify(resp, null, 4);
            console.log(resp);
            let objRes = JSON.parse(ss);

            this.presentToast("Zona registrada")
            window.location.reload();
            resolve(true);
          },
          async (err) => {
            console.log("ERROR =>" + JSON.stringify(err));




            //this.storage.clear();
            resolve(false);
          }
        );
    });
    //FIN
  }
  getZonas() {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getZonas'//,

      //{ headers: headers }
    );
  }
  getMortalidades() {
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getMortalidades'//,
      //{ headers: headers }
    );

  }
  getMortalidadesSemanaEpi(anio, semana) {
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getMortalidadesXSemanaEpi?anio=' + anio + '&semana=' + semana + ''//,
      //{ headers: headers }
    );

  }
  getSemanasEpiMortal() {
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getSemanasEpiMortalidades'//,
      //{ headers: headers }
    );

  }

  async updateEstadoZona(id, estado) {
    //APLICAR LLAMADA POST
    var data = {
      id: id,
      estado: estado
    }
    var app = this;
    const headers = new HttpHeaders().set("Authorization", '');
    return new Promise((resolve) => {
      this.http
        .post(
          'https://pssoft.cl/influenzaAviarrest/updateEstadoZona',
          data,
          { headers: headers }
        )
        .subscribe(
          (resp) => {
            let ss = JSON.stringify(resp, null, 4);
            console.log(resp);
            let objRes = JSON.parse(ss);

            this.presentToast("Zona actualizada")
            
            this.geometricaBD(app);
            resolve(true);
          },
          async (err) => {
            console.log("ERROR =>" + JSON.stringify(err));




            //this.storage.clear();
            resolve(false);
          }
        );
    });
    //FIN
  }
}
