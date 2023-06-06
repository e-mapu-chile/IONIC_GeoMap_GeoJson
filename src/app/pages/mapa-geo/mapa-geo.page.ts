import { Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { read } from 'shapefile'; // Importa "open" en lugar de "load"
import 'leaflet-draw';
import { Storage } from '@ionic/storage';
import 'leaflet-routing-machine';

import { Preferences } from '@capacitor/preferences';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from "xlsx";
import { NgForm } from '@angular/forms';
import { webSocket } from 'rxjs/webSocket';



@Component({
  selector: 'app-mapa-geo',
  templateUrl: './mapa-geo.page.html',
  styleUrls: ['./mapa-geo.page.scss'],
})
export class MapaGeoPage implements OnInit {
  @ViewChild(IonModal) modal2: IonModal;
  mostrarDivCargandoEstab: boolean = false;
  mostrarDivAboutGeoMapSSA: boolean = false;
  habilitarDrag: boolean = false;
  textoMenuToolDrag: string = "Habilitar Drag and Drop"
  logeado: boolean = true;
  objetoPerfiles: any = {};
  vinculadoSag: boolean = false;
  perfiles: string = "";
  mostrarDivFlotante: boolean = false;
  mostrarDivFlotante2: boolean = false;
  selectedFile: any;
  contieneRupsEncontrados: boolean = false;
  loading: HTMLIonLoadingElement;
  map: Leaflet.Map;
  presentingElement = null;
  nombreUsuarioLogeado = "";
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
  region: number = 0;
  sipecRupLabel = "Vacio";
  radioRup = 100;
  tiempoAnimacion = 500;
  rubroColoresList: any[] = [];
  rubroColoresListHtml: any[] = [];
  arrayLeafletRupGeo = [];
  listaCheckRubro = [];
  listaRegionesMaster = [];
  listaRegionesMaster2 = [];
  listasRegiones = [];
  listaTipoEstabMaster = [];
  listasTipoEstab = [];
  region1 = false;
  region2 = false;
  region3 = false;
  region4 = false;
  region5 = false;
  region6 = false;
  region7 = false;
  region8 = false;
  region9 = false;
  region10 = false;
  region11 = false;
  region12 = false;
  region13 = false;
  region14 = false;
  region15 = false;
  region16 = false;
  verSipec: boolean = false;
  checkSipecVal = false;
  MATADEROCh = false;
  BROILERCh = false;
  LEEPCh = false;
  CENTROCh = false;
  PLAYACh = false;
  PREDIOCh = false;
  URBANOCh = false;
  PUERTOCh = false;
  RURALCh = false;
  PLANTELCh = false;
  HUMEDALCh = false;
  clasificacionSanitaLabel = "Vacio";
  verClasificacionesSSA: boolean = false;
  arrayLeafletClasificacionSSAGeo = [];
  vigilanciaSSALabel = "Vacio";
  verVigilanciaSSA: boolean = false;
  arrayLeafletVigilanciaSSAGeo = [];
  lineaTiempoVigilanciaSSA = [];
  contadorGlobalLineaTiempoVSsa = 2;//que inicie el boton play, despues el 1 sera boton play show
  visualizaTiempoVigilanciaSSA = false;
  mostrarDivFlotanteTime = false;
  fechaTomaMuestraLabel = "";
  conTipoEstab = false;
  clasPositivo = false;
  clasNegativo = false;
  soloPositivo = 0;
  soloNegativo = 0;
  regionesLabel = "Vacio";
  verRegiones: boolean = false;
  arrayLeafletRegionesP = [];
  arrayLeafletRegionesMP = [];
  provinciaLabel = "Vacio";
  verProvincias: boolean = false;
  arrayLeafletProvinciasP = [];
  arrayLeafletProvinciasMP = [];
  comunaLabel = "Vacio";
  verComunas: boolean = false;
  arrayLeafletComunasP = [];
  arrayLeafletComunasMP = [];
  mostrarDivFlotanteSel = false;
  //FORMULARIO POPUP
  rupForm = "";
  tipoEstabForm = "";
  rubroForm = "";
  clasificacionSanitariaActualForm = "";
  especieForm = "";
  enfermedadForm = "";
  medidasSanitariasForm = "";
  fechaClasificacionForm = "";
  clasifiacionSSAForm = "";
  listadoRupsEncontrados = [];

  //FIN FORMULARIO POPUP
  loginUser = {
    userName: "",
    password: "",
  };
  constructor(private storage: Storage,
    private http: HttpClient,
    public loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  //#region COMPONENTES VISUALES
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
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'Su base de datos local se actualizara',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.establecimientosBD();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertClasSani() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'Su base de datos local se actualizara',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.clasificacionesSanitariaBD();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertResultado(regionId) {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'Su base de datos local se actualizara',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            await this.resultadosBD(regionId);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertRegiones() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: '¿Desea cargar las regiones?',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            await this.getRegionShapeGeoJson();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertProvincia() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: '¿Desea cargar las provincias?',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            await this.getProvinciaShapeGeoJson();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertComuna() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: '¿Desea cargar las comunas?',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            await this.getComunaShapeGeoJson();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertVigilanciaSSA() {
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: '¿Desea cargar la vigilancia SSA?',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            await this.vigilanciaSSABD();
          }
        }
      ]
    });

    await alert.present();
  }


  //#endregion
  //#region INICIAR MAPA
  async ionViewDidEnter() {
    //  await this.getSantuariosNaturalesShapeGeoJson();
    // // // // const socket = webSocket('ws://localhost:8180');

    // // // // const clientId = 'myClientId'; // Este sería el identificador del cliente

    // // // // socket.next({ clientId: clientId }); // Envía el identificador del cliente al servidor

    // // // // socket.subscribe(
    // // // //   (message) => console.log('Mensaje recibido:', message),
    // // // //   (error) => console.error('Error:', error),
    // // // //   () => console.log('Conexión cerrada')
    // // // // );
    await this.cargarExcelPrediosMalGeo();
    await this.validarUserLocal();
    if (this.logeado) {
      await this.iniciarRegionesList();
      await this.iniciarTipoEstabList();
      await this.rubrosColoresBD();
      await this.validarDataLocal();
    }
    this.map = new Leaflet.map('mapId5').setView([-23.407377534587543, -67.96089334899497], 6);


    const baselayers = {
      "Openstreetmap": Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: 'División de Protección Pecuaria - Sanidad Animal'
        }),
      "GoogleStreets": Leaflet.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'División de Protección Pecuaria - Sanidad Animal'
      }),
      "GoogleHybrid": Leaflet.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'División de Protección Pecuaria - Sanidad Animal'
      }),

      "GoogleTerrain": Leaflet.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'División de Protección Pecuaria - Sanidad Animal'
      }),
      "Positron": Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: 'División de Protección Pecuaria - Sanidad Animal'

      }),
      "Oscuro": Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: 'División de Protección Pecuaria - Sanidad Animal'

      }),
      "TopoMap ": Leaflet.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'División de Protección Pecuaria - Sanidad Animal'

      }),
    };
    Leaflet.control.scale().addTo(this.map);
    var overlays = {};
    Leaflet.control.layers(baselayers, overlays).addTo(this.map);
    baselayers["GoogleTerrain"].addTo(this.map);
    this.drawnItems = new Leaflet.FeatureGroup();
    this.map.addLayer(this.drawnItems);
    var options = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>error!<strong> trata de intentarlo otra vez!' // Message that will show when intersect
          },
          shapeOptions: {
            color: 'blue',
            weight: 1
          },
          showArea: true,
          metric: false,
          feet: false
        },
        rectangle: false,
        polyline: false,
        circle: true,
        marker: false,
        circlemarker: false,// Turns off this drawing tool

      },
      edit: {
        featureGroup: this.drawnItems //REQUIRED!!
        // edit: false, // agregar esta línea
        // remove: false
      }
    };
    var drawControl = new Leaflet.Control.Draw(options);
    this.map.addControl(drawControl);

    // var options2 = {
    //  // position: 'right',
    //   draw: {
    //     polygon: {
    //       allowIntersection: false, // Restricts shapes to simple polygons
    //       drawError: {
    //         color: '#e1e100', // Color the shape will turn when intersects
    //         message: '<strong>error!<strong> trata de intentarlo otra vez!' // Message that will show when intersect
    //       },
    //       shapeOptions: {
    //         color: 'blue',
    //         weight: 1
    //       },
    //       showArea: true,
    //       metric: false,
    //       feet: false
    //     },
    //     rectangle: false,
    //     polyline: false,
    //     circle: true,
    //     marker: false,
    //     circlemarker: false,// Turns off this drawing tool

    //   },
    //   edit: {
    //     featureGroup: this.drawnItems, //REQUIRED!!
    //     edit: false, // agregar esta línea
    //     remove: false
    //   }
    // };
    // var drawControl2 = new Leaflet.Control.Draw(options2);
    // this.map.addControl(drawControl2);

    var app = this;
    this.map.on(Leaflet.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        layer.bindPopup('A popup!');
        console.log("POLIGONO MARKER");
        // console.log(layer.getLatLng());
      }
      else {
        app.tipoFigura = type;
        if (type == "circle") {
          console.log("RADIO");
          // console.log(layer._latlng);
          // console.log(layer._mRadius);
          app.pointCirculo = layer._latlng;
          app.radioCirculo = layer._mRadius;
          //  app.intercepcionesPredios(e, layer,"inicioMapa");
          //app.modal2.present();
        } else {
          console.log("POLIGONO");
          console.log("type => " + type)

          app.arrayPoligonoTemp = layer.getLatLngs();
          //  app.intercepcionesPredios(e, layer,"inicioMapa");
          //app.modal2.present();
        }
      }
      if (!app.habilitarDrag) {
        layer.on('click', function (e) {
          // Aquí puedes agregar el código que quieras que se ejecute al hacer clic en la capa
          app.intercepcionesPredios(e, layer, "inicioMapa");
        });
      }

      app.drawnItems.addLayer(layer);

      if (app.habilitarDrag) {
        var draggable = new Leaflet.Draggable(layer._path);
        draggable.enable();
        draggable.on('dragend', function (e) {
          var newBounds = layer.getBounds();
          //  console.log(newBounds);
          var newLat = newBounds.getCenter().lat;
          var newLng = newBounds.getCenter().lng;

          // Haz lo que necesites con las nuevas coordenadas
          //console.log("Nuevas coordenadas: " + newLat + ", " + newLng);
        });
      }
    });
  }
  //#endregion
  //#region EVENTOS HTML

  async toolDragClick() {
    if (this.habilitarDrag) {
      this.habilitarDrag = false;
      this.textoMenuToolDrag = "Habilitar Drag and Drop";
    } else {
      this.habilitarDrag = true;
      this.textoMenuToolDrag = "Desactivar Drag and Drop";
    }

  }
  async handleChange(e) {
    this.region = e.target.value;
    if (this.verSipec == true) {

      if (this.sipecRupLabel == 'Con Datos') {
        //ver
        await this.getLocalEstablecimientosSipec(this.region);
      }
    }
  }
  async checkSipec(e) {
    if (this.verSipec == false) {
      this.verSipec = true;
      this.checkSipecVal = true;
      if (this.sipecRupLabel == 'Con Datos' && this.region > 0) {
        //ver
        await this.getLocalEstablecimientosSipec(this.region);
      }
      else {
        //debe tener datos
        this.presentToast("Debe tener datos descargados de SIPEC y debe seleccionar una región")
      }
    } else {
      this.verSipec = false;
      this.checkSipecVal = false;
      await this.limpiarLocalEstablecimientosSipec();
    }
  }
  async checkFiltroRegion(idss, o) {
    //console.log(idss)
    this.region = idss;
    //#region REGIONES IF
    if (this.region == 15) {
      var latlong = [-18.516187677818824, -69.76222405619846]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region15 == false) {
        this.region15 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region15 = false;
      }
      if (this.region15) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }
    }
    if (this.region == 1) {
      var latlong = [-20.060953040353358, -69.51150896859357]
      var zoom = 8

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region1 == false) {
        this.region1 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region1 = false;
      }
      if (this.region1) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 2) {
      var latlong = [-23.355974780599126, -69.6615535558908]
      var zoom = 8

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region2 == false) {
        this.region2 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region2 = false;
      }
      if (this.region2) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }
    }
    if (this.region == 3) {
      var latlong = [-27.412307703988816, -70.54374518861384]
      var zoom = 8

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region3 == false) {
        this.region3 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region3 = false;
      }
      if (this.region3) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }
    }
    if (this.region == 4) {
      var latlong = [-30.746619590977843, -71.05387705747358]
      var zoom = 8

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region4 == false) {
        this.region4 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region4 = false;
      }
      if (this.region4) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 5) {
      var latlong = [-32.70436447667814, -70.95984882326344]
      var zoom = 9


      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region5 == false) {
        this.region5 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region5 = false;
      }
      if (this.region5) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 6) {
      var latlong = [-34.430652358299476, -71.2279935899269]
      var zoom = 9


      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region6 == false) {
        this.region6 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region6 = false;
      }
      if (this.region6) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 7) {
      var latlong = [-35.223361969063916, -71.39805645776494]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region7 == false) {
        this.region7 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region7 = false;
      }
      if (this.region7) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 16) {
      var latlong = [-36.5772197444015, -72.15879217700547]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region16 == false) {
        this.region16 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region16 = false;
      }
      if (this.region16) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 8) {
      var latlong = [-37.36980640534019, -72.49074875361131]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region8 == false) {
        this.region8 = true;
        this.volar(latlong, zoom)
      } else {
        this.region8 = false;
      }
      if (this.region8) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 9) {
      var latlong = [-38.62674682882578, -72.52474085019935]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region9 == false) {
        this.region9 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region9 = false;
      }
      if (this.region9) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 14) {
      var latlong = [-39.95877780425659, -72.75537257668081]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region14 == false) {
        this.region14 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region14 = false;
      }
      if (this.region14) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 10) {
      var latlong = [-41.63485246688772, -72.8372067226002]
      var zoom = 8


      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region10 == false) {
        this.region10 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region10 = false;
      }
      if (this.region10) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 11) {
      var latlong = [-47.10628340941387, -73.03962608717735]
      var zoom = 8

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region11 == false) {
        this.region11 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region11 = false;
      }
      if (this.region11) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 12) {
      var latlong = [-52.44016948146089, -71.9987278452679]
      var zoom = 8

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region12 == false) {
        this.region12 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region12 = false;
      }
      if (this.region12) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    if (this.region == 13) {
      var latlong = [-33.51326619122383, -70.64131761082221]
      var zoom = 9

      //FILTER MULTIPLE OBEJETO PARA GEOJSON
      var dataR = this.listasRegiones.filter((f) => f.regionId != this.region)
      this.listasRegiones = dataR || [];
      if (this.region13 == false) {
        this.region13 = true;
        await this.volar(latlong, zoom)
      } else {
        this.region13 = false;
      }
      if (this.region13) {
        var os = {
          regionId: this.region,
          check: true
        }
        this.listasRegiones.push(os);
      } else {
        var os = {
          regionId: this.region,
          check: false
        }
        this.listasRegiones.push(os);
      }

    }
    //#endregion

    await this.getLocalEstablecimientosSipec(0);
    await this.getLocalClasificacionSanitariaSSA();
    await this.getLocalRegionShapeGeoJson();
    await this.getLocalProvinciaShapeGeoJson();
    await this.getLocalComunaShapeGeoJson();
  }
  async checkClasifcacionSSA(e) {
    if (this.verClasificacionesSSA == false) {
      this.verClasificacionesSSA = true;

      if (this.sipecRupLabel == 'Con Datos' &&
        this.clasificacionSanitaLabel == 'Con Datos') {
        //ver
        await this.getLocalClasificacionSanitariaSSA();
      }
      else {
        //debe tener datos
        this.presentToast("Debe tener datos descargados de SIPEC y debe seleccionar una región")
      }
    } else {
      this.verClasificacionesSSA = false;
      await this.limpiarLocalClasificacionSanitariaSSA();
    }
  }
  async checkRegiones(e) {
    if (this.verRegiones == false) {
      this.verRegiones = true;
      this.verProvincias = false;
      const xL = await this.cargando("Espere, pintando...");
      await this.getLocalRegionShapeGeoJson();
      this.loading.dismiss();
    } else {
      this.verRegiones = false;
      await this.limpiarLocalRegionesShape();
    }
  }
  async checkProvincias(e) {
    if (this.verProvincias == false) {
      this.verProvincias = true;
      this.verRegiones = false;
      const xL = await this.cargando("Espere, pintando...");
      await this.getLocalProvinciaShapeGeoJson();
      this.loading.dismiss();
    } else {
      this.verProvincias = false;
      await this.limpiarLocalProvinciasShape();
    }
  }
  async checkComunas(e) {
    if (this.verComunas == false) {
      this.verComunas = true;
      this.verRegiones = false;
      const xL = await this.cargando("Espere, pintando...");
      await this.getLocalComunaShapeGeoJson();
      this.loading.dismiss();
    } else {
      this.verComunas = false;
      await this.limpiarLocalcomunasShape();
    }
  }
  async checkVigilanciaSSA(e) {
    if (this.verVigilanciaSSA == false) {
      this.verVigilanciaSSA = true;
      this.visualizaTiempoVigilanciaSSA = true;
      //const xL = await this.cargando("Espere, pintando...");
      await this.getLineaTiempoVigilanciaSSA();
      //  await this.getLocalVigilanciaSSA();
      // this.loading.dismiss();
    } else {
      this.verVigilanciaSSA = false;
      this.visualizaTiempoVigilanciaSSA = false;
      this.mostrarDivFlotanteTime = false;
      await this.limpiarLocalVigilanciaSSA();
    }
  }
  async playVigilanciaSSA() {
    await this.limpiarLocalVigilanciaSSA();
    this.contadorGlobalLineaTiempoVSsa = 0;
    this.mostrarDivFlotanteTime = true;
    this.fechaTomaMuestraLabel = "";
    const timeAnimacion = await this.storage.get('tiempoAnimacion')
    var timeR = timeAnimacion || 100;
    timeR;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < this.lineaTiempoVigilanciaSSA.length; i++) {
      if (this.contadorGlobalLineaTiempoVSsa == 0) {
        await delay(timeR);
        await this.getLocalVigilanciaSSA(this.lineaTiempoVigilanciaSSA[i].fechaReal, this.lineaTiempoVigilanciaSSA[i].fechaprint);
      } else {
        break;
      }
    }
  }
  async stopVigilanciaSSA() {
    this.contadorGlobalLineaTiempoVSsa = 1;

  }
  async irDia(fechaReal, fechaPrint) {
    this.contadorGlobalLineaTiempoVSsa = 2;
    const divElement = document.getElementById(fechaPrint);
    divElement.className = 'cuboDiaClick';
    await this.limpiarLocalVigilanciaSSA();
    await this.getLocalVigilanciaSSA(fechaReal, fechaPrint);
  }
  swiFiltroSipec = 0;
  listas = [];
  async checkFiltroRubro(e, obb) {

    await this.getLocalEstablecimientosSipec(0);
    await this.getLocalClasificacionSanitariaSSA();

  }
  async checkFiltroTipoEstab(idss, obb) {
    console.log(idss)
    var dataR = this.listasTipoEstab.filter((f) => f.idTipoEstab != idss)
    this.listasTipoEstab = dataR || [];
    if (idss == 149) {
      if (this.MATADEROCh == false) {
        this.MATADEROCh = true;
        var os = {
          idTipoEstab: 149,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.MATADEROCh = false;
        var os = {
          idTipoEstab: 149,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 46) {
      if (this.BROILERCh == false) {
        this.BROILERCh = true;
        var os = {
          idTipoEstab: 46,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.BROILERCh = false;
        var os = {
          idTipoEstab: 46,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 999) {
      if (this.LEEPCh == false) {
        this.LEEPCh = true;
        var os = {
          idTipoEstab: 999,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.LEEPCh = false;
        var os = {
          idTipoEstab: 999,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 150) {
      if (this.CENTROCh == false) {
        this.CENTROCh = true;
        var os = {
          idTipoEstab: 150,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.CENTROCh = false;
        var os = {
          idTipoEstab: 150,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 188) {
      if (this.PLAYACh == false) {
        this.PLAYACh = true;
        var os = {
          idTipoEstab: 188,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.PLAYACh = false;
        var os = {
          idTipoEstab: 188,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 1) {
      if (this.PREDIOCh == false) {
        this.PREDIOCh = true;
        var os = {
          idTipoEstab: 1,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.PREDIOCh = false;
        var os = {
          idTipoEstab: 1,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 190) {
      if (this.URBANOCh == false) {
        this.URBANOCh = true;
        var os = {
          idTipoEstab: 190,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.URBANOCh = false;
        var os = {
          idTipoEstab: 190,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 888) {
      if (this.PUERTOCh == false) {
        this.PUERTOCh = true;
        var os = {
          idTipoEstab: 888,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.PUERTOCh = false;
        var os = {
          idTipoEstab: 888,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 189) {
      if (this.RURALCh == false) {
        this.RURALCh = true;
        var os = {
          idTipoEstab: 189,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.RURALCh = false;
        var os = {
          idTipoEstab: 189,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 151) {
      if (this.PLANTELCh == false) {
        this.PLANTELCh = true;
        var os = {
          idTipoEstab: 151,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.PLANTELCh = false;
        var os = {
          idTipoEstab: 151,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    if (idss == 152) {
      if (this.HUMEDALCh == false) {
        this.HUMEDALCh = true;
        var os = {
          idTipoEstab: 152,
          check: true
        }
        this.listasTipoEstab.push(os);
      } else {
        this.HUMEDALCh = false;
        var os = {
          idTipoEstab: 152,
          check: false
        }
        this.listasTipoEstab.push(os);
      }
    }
    console.log(this.listasTipoEstab)

    await this.getLocalEstablecimientosSipec(0);
    await this.getLocalClasificacionSanitariaSSA();

  }
  async checkFiltroClasiR(idss, obb) {
    console.log(idss);
    if (idss == 0) {
      if (this.conTipoEstab == false)
        this.conTipoEstab = true;
      else
        this.conTipoEstab = false;
    }
    if (idss == 1) {
      if (this.clasPositivo == false)
        this.clasPositivo = true;
      else
        this.clasPositivo = false;
    }
    if (idss == 2) {
      if (this.clasNegativo == false)
        this.clasNegativo = true;
      else
        this.clasNegativo = false;
    }

    await this.getLocalClasificacionSanitariaSSA();

  }

  //#endregion
  //#region METODOS
  async validarUserLocal() {
    const token = await this.storage.get("token");
    const nombreUsuario = await this.storage.get("nombreUsuario")
    this.nombreUsuarioLogeado = nombreUsuario;
    const perfiles = await this.storage.get("perfiles")
    console.log(perfiles);
    if (token != undefined && token != null && token != "[]") {
      console.log("HAY ALGUIEN");
      this.nombreUsuarioLogeado = nombreUsuario;
      var jDa = perfiles
      this.objetoPerfiles = JSON.parse(jDa);
      this.perfiles = perfiles;
      this.logeado = true;
    } else {
      console.log("NO LOGEADO")
      this.perfiles = "{}";
      this.nombreUsuarioLogeado = "";
      this.logeado = false;
    }
  }
  async validarDataLocal() {
    const xL = await this.cargando("Espere, iniciando los componentes...");
    const radioRupBd = await this.storage.get('radioRup')
    var radioR = radioRupBd || 1;
    this.radioRup = radioR;

    const timeAnimacion = await this.storage.get('tiempoAnimacion')
    var timeR = timeAnimacion || 100;
    this.tiempoAnimacion = timeR;

    const dataJ = await this.storage.get('establecimientosAves')
    var dataJO = dataJ || [];
    if (dataJO.length > 0) {
      this.sipecRupLabel = "Con Datos"
    }
    const dataJcs = await this.storage.get('clasificacionSanitaria')
    var dataJOcs = dataJcs || [];
    if (dataJOcs.length > 0) {
      this.clasificacionSanitaLabel = "Con Datos"
    }
    const dataJR = await this.storage.get('regionPolygon')
    var dataJOR = dataJR || [];
    if (dataJOR.length > 0) {
      this.regionesLabel = "Con Datos"
    }
    const dataJP = await this.storage.get('provinciaMultipolygon')
    var dataJOP = dataJP || [];
    if (dataJOP.length > 0) {
      this.provinciaLabel = "Con Datos"
    }
    const dataJC = await this.storage.get('comunaMultipolygon')
    var dataJOC = dataJC || [];
    if (dataJOC.length > 0) {
      this.comunaLabel = "Con Datos"
    }
    const dataJV = await this.storage.get('vigilanciaSSA')
    var dataJOV = dataJV || [];
    if (dataJOV.length > 0) {
      this.vigilanciaSSALabel = "Con Datos"
    }

    this.loading.dismiss();
  }
  async iniciarRegionesList() {
    var re = [15, 1, 2, 3, 4, 5, 6, 7, 16, 8, 9, 14, 10, 11, 12, 13]

    re.forEach(async element => {
      var nombreRegion = "";
      if (element == 15)
        nombreRegion = 'ARICA Y PARINACOTA'
      if (element == 1)
        nombreRegion = 'TARAPACÁ'
      if (element == 2)
        nombreRegion = 'ANTOFAGASTA'
      if (element == 3)
        nombreRegion = 'ATACAMA'
      if (element == 4)
        nombreRegion = 'COQUIMBO'
      if (element == 5)
        nombreRegion = 'VALPARAISO'
      if (element == 6)
        nombreRegion = 'OHIGGINS'
      if (element == 7)
        nombreRegion = 'MAULE'
      if (element == 16)
        nombreRegion = 'ÑUBLE'
      if (element == 8)
        nombreRegion = 'BIO BIO'
      if (element == 9)
        nombreRegion = 'ARAUCANÍA'
      if (element == 14)
        nombreRegion = 'LOS RÍOS'
      if (element == 10)
        nombreRegion = 'LOS LAGOS'
      if (element == 11)
        nombreRegion = 'AYSÉN'
      if (element == 12)
        nombreRegion = 'MAGALLANES Y LA ANTÁRTICA CHILENA'
      if (element == 13)
        nombreRegion = 'METROPOLITANA'
      var existe = await this.existenResultadosRegion(element);
      var o = {
        idRegion: element,
        nombre: nombreRegion,
        existe: existe
      }

      this.listaRegionesMaster.push(o);
    });
  }
  async existenResultadosSSAxRegion() {
    var re = [15, 1, 2, 3, 4, 5, 6, 7, 16, 8, 9, 14, 10, 11, 12, 13]

    re.forEach(async element => {
      var nombreRegion = "";
      if (element == 15)
        nombreRegion = 'ARICA Y PARINACOTA'
      if (element == 1)
        nombreRegion = 'TARAPACÁ'
      if (element == 2)
        nombreRegion = 'ANTOFAGASTA'
      if (element == 3)
        nombreRegion = 'ATACAMA'
      if (element == 4)
        nombreRegion = 'COQUIMBO'
      if (element == 5)
        nombreRegion = 'VALPARAISO'
      if (element == 6)
        nombreRegion = 'OHIGGINS'
      if (element == 7)
        nombreRegion = 'MAULE'
      if (element == 16)
        nombreRegion = 'ÑUBLE'
      if (element == 8)
        nombreRegion = 'BIO BIO'
      if (element == 9)
        nombreRegion = 'ARAUCANÍA'
      if (element == 14)
        nombreRegion = 'LOS RÍOS'
      if (element == 10)
        nombreRegion = 'LOS LAGOS'
      if (element == 11)
        nombreRegion = 'AYSÉN'
      if (element == 12)
        nombreRegion = 'MAGALLANES Y LA ANTÁRTICA CHILENA'
      if (element == 13)
        nombreRegion = 'METROPOLITANA'
      var existe = await this.existenResultadosRegion(element);
      var o = {
        idRegion: element,
        nombre: nombreRegion,
        existe: existe
      }

      this.listaRegionesMaster2.push(o);
    });
  }
  async existenResultadosRegion(regionId) {
    var nombTabla = 'resultados_' + regionId;
    const d1 = await this.storage.get(nombTabla)
    var o1 = d1 || [];
    if (o1.length > 0)
      return true;

    return false;
  }
  async iniciarTipoEstabList() {
    var o = {
      id: 149,
      nombre: 'MATADERO'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 46,
      nombre: 'SECTOR REPRODUCTORES BROILER'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 999,
      nombre: 'LEEP'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 150,
      nombre: 'CENTRO  '
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 188,
      nombre: 'PLAYA'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 1,
      nombre: 'PREDIO'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 190,
      nombre: 'SECTOR PUBLICO URBANO'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 888,
      nombre: 'PUERTO'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 189,
      nombre: 'SECTOR PUBLICO RURAL'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 151,
      nombre: 'PLANTEL'
    }
    this.listaTipoEstabMaster.push(o);
    var o = {
      id: 152,
      nombre: 'HUMEDAL'
    }
    this.listaTipoEstabMaster.push(o);

    console.log(this.listaTipoEstabMaster)

  }
  async guardarRadioRup() {

    await this.storage.set('radioRup', this.radioRup)
  }
  async guardarTiempoAnimacion() {
    await this.storage.set('tiempoAnimacion', this.tiempoAnimacion)
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
  cancel() {
    this.modal2.dismiss(null, 'cancel');
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      //this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  cerrarPopup() {
    this.mostrarDivFlotante = false;
    this.mostrarDivFlotante2 = false;
  }
  async setDataPopupRup(rup, arrayObjRup) {
    var dataEst = await this.storage.get("establecimientosAves");
    var dataAE = dataEst || [];
    var data = await this.storage.get("clasificacionSanitaria");
    var dataAS = data || [];

    this.rupForm = rup;
    var rupFilt = dataAE.filter((e) => e.properties.rup == rup);
    this.tipoEstabForm = rupFilt[0].properties.tipoEstab;
    this.rubroForm = rupFilt[0].properties.rubro;

    var rupFilSC = dataAS.filter((f) => f.properties.rup == rup);
    if (rupFilSC.length > 0) {
      this.clasificacionSanitariaActualForm = rupFilSC[0].properties.clasificacion;
      this.especieForm = rupFilSC[0].properties.especie;
      this.enfermedadForm = rupFilSC[0].properties.enfermedad;
      this.medidasSanitariasForm = rupFilSC[0].properties.medidasSanitarias;
      this.fechaClasificacionForm = rupFilSC[0].properties.fechaClasificacion;
    } else {
      this.clasificacionSanitariaActualForm = "Sin clasificación sanitaria"
      this.especieForm = "";
      this.enfermedadForm = "";
      this.medidasSanitariasForm = "";
      this.fechaClasificacionForm = "";
    }
    if (arrayObjRup.length > 0) {
      this.contieneRupsEncontrados = true;
      this.listadoRupsEncontrados = arrayObjRup;
    }
    else {
      this.contieneRupsEncontrados = false;
    }

  }
  async verRupsEncontrados() {
    this.mostrarDivFlotante2 = true;
  }
  cerrarPopup2() {
    this.mostrarDivFlotante2 = false;
  }
  async aboutGeoMap() {
    this.mostrarDivAboutGeoMapSSA = true;
  }
  cerrarPopupAbout() {
    this.mostrarDivAboutGeoMapSSA = false;
  }
  async quitarEstab(){
    const xL = await this.cargando("Espere, quitando predios del mapa");
    var data = await this.storage.get("establecimientosAves");
    var dataA = data || [];
    const result = dataA.filter(item => !this.listadoRupsEncontrados.some((f) => f.rup === item.properties.rup));
    var dataR = result || [];
    await this.storage.set('establecimientosAves', dataR)
    await this.getLocalEstablecimientosSipec(1);
    this.mostrarDivFlotante2 = false;
    this.mostrarDivFlotanteSel = false;
    this.loading.dismiss();
  }
  async descargarSabanaExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    var analisisL = []

    this.listadoRupsEncontrados.forEach(e => {
      let obj = {
        RUP: e.rup,
        Tipo_Establecimiento: e.tipoEstab,
        Rubro: e.rubro,
        Clasificacion_Actual: e.clasificacionSanitariaActualForm,
        Fecha_Clasificacion: e.fechaClasificacionForm,
        Medida_Sanitaria: e.medidasSanitariasForm,
        Latitud: e.latitud,
        Longitud: e.longitud,
        x: e.x,
        y: e.y,
        huso: e.huso,
        oficina: e.oficina
      }
      analisisL.push(obj)
    });

    const analisisXlsa: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      analisisL
    );
    XLSX.utils.book_append_sheet(wb, analisisXlsa, "EstablecimientosEncontrados");
    /* save to file */
    let nombreArchivo =
      "EstablecimientosRadio" + new Date().toISOString() + ".xlsx";
    XLSX.writeFile(wb, nombreArchivo);

  }
  cerrarPopupSel() {
    this.mostrarDivFlotanteSel = false;
    this.mostrarDivFlotante2 = false;
  }
  async logout() {
    await this.guardarIndexDB(undefined, '', '')
    this.nombreUsuarioLogeado = "";
    this.logeado = false;
    this.objetoPerfiles = '{}';
  }
  async guardarIndexDB(token, nombreUsuario, perfiles) {
    await this.storage.set("token", token)
    await this.storage.set("nombreUsuario", nombreUsuario)
    await this.storage.set("perfiles", perfiles)
    this.nombreUsuarioLogeado = nombreUsuario;
    console.log("ROLES => " + perfiles)
    this.objetoPerfiles = perfiles;
  }
  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async login(fLogin: NgForm) {
    if (fLogin.invalid) {
      return;
    }
    await this.cargando("espere");
    this.loading.dismiss();
    return new Promise((resolve) => {
      this.getUsuarioBD(this.loginUser.userName,
        this.loginUser.password,).subscribe(async (resp) => {
          let ss = JSON.stringify(resp, null, 4);
          // console.log("respuesta API= " + ss);
          //const dataJ = JSON.parse(ss);
          const da = JSON.parse(ss);
          const objUsuario = da || [];
          if (objUsuario.usuario == '[]') {
            // NO EXISTE EN LA BD
            console.log("NO EXSTE")
          } else {
            var usOb = JSON.parse(da.usuario)
            if (usOb[0].MensajeVinculo == "Validando Cuenta SAG") {
              this.cargando("validando su cuenta SAG");
              await this.sleep(8000);
              this.loading.dismiss();
              this.cargando("espere...el sistema esta buscando su cuenta de usuario");
              await this.sleep(10000);
              this.loading.dismiss();
              this.cargando("preparando para validar la acción");
              await this.sleep(8000);
              this.loading.dismiss();

              await this.login(fLogin);



            } else {
              console.log(usOb[0].MensajeVinculo)
              if (usOb[0].MensajeVinculo == "Usuario no existe en SIPEC") {
                this.logeado = false;
                this.guardarIndexDB(undefined, '', '');
                this.presentToast("No existe usuario SAG");
                this.loading.dismiss();
              } else {
                if (usOb[0].MensajeVinculo == "Cuenta Vinculada al SAG") {

                  console.log("ROLES => " + usOb[0].Roles)
                  await this.guardarIndexDB(usOb[0].TokenVinculo, usOb[0].Usuario, usOb[0].Roles);
                  await this.presentToast("Bienvenido");
                  window.location.reload();

                  this.loading.dismiss();
                }
              }
              this.loading.dismiss();
            }

          }
          this.loading.dismiss();
          //
          resolve(true);
        },
          (err) => {

            //this.storage.clear();
            this.loading.dismiss();
            resolve(false);
          });
    });


  }
  getUsuarioBD(usuario, password) {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://pssoft.cl/influenzaAviarRest/login?user=' + usuario + '&password=' + password + ''//,

      //{ headers: headers }
    );
  }

  async cargarExcelPrediosMalGeo() {
    const filePath = 'assets/XlsRupMalos/RupMalosGeo.xlsx';
    this.http.get(filePath, { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      this.storage.set('establecimientosAvesMalos', jsonData)
    });
  }


  //#endregion
  //#region METODOS DE OBTENER DATOS BD SAG
  //#region ESTABLECIMIENTOS
  flagU2 = 0;
  jsonConcat;
  async establecimientosBD() {
    this.storage.set('establecimientosAves', [])
   
    const xL = await this.cargando("Espere, cargando establecimientos SIPEC");
    try {

      this.getEstablecimientos(this.region).subscribe((resp) => {
        let ss = JSON.stringify(resp, null, 4);
        //console.log("respuesta API DATASET= " + ss);
        const dataJ = JSON.parse(ss);
        this.jsonConcat = [];

        dataJ.forEach(async z => {
          var latitudN = parseFloat(z.Latitud);
          var longitudN = parseFloat(z.Longitud);
          var colorB = this.rubroColoresList.filter((f) => f.rubro == z.Rubro);
          var vcola = colorB || [];

          
          var jso = await this.radioGeoJson(latitudN, longitudN, 1, vcola[0].color, z.Region, z.Rup,
            z.TipoEstabId, z.TipoEstab, z.RubroId, z.Rubro, z.Oficina, z.CoordenadaX, z.CoordenadaY, z.Huso,1);

          console.log(JSON.stringify(jso));
          this.jsonConcat.push(jso);
        });

        console.log(this.jsonConcat)
        this.storage.set('establecimientosAves', this.jsonConcat)

        this.sipecRupLabel = "Con Datos"

        this.loading.dismiss();

      });
    } catch {
      this.presentToast("Error al traer establecimientos");
      this.loading.dismiss();
    }
  }
  getEstablecimientos(regionId) {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://sinaptest.sag.gob.cl/api/apilab/BuscarEstablecimientosSIPEC?idUltimo=0'// + regionId + ''//,

      //{ headers: headers }
    );
  }
  async rubrosColoresBD() {
    // const xL = await this.cargando("Espere, cargando filtros ");
    this.getRubroColor().subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);
      var myLines = [];
      var flag = 0;
      var arrCr = []
      this.rubroColoresList = [];
      dataJ.rubroColores.forEach(z => {

        var ob = {
          id: z.Id,
          rubro: z.Rubro,
          color: z.ColorRubro
        }
        this.rubroColoresList.push(ob);

        var obj = {
          rubro: z.Rubro,
          idCheck: z.Id,
          checked: false
        }
        this.listaCheckRubro.push(obj);


      });

      //console.log(JSON.stringify(myLines))

      //  this.loading.dismiss();
    });
  }
  getRubroColor() {
    return this.http.get(
      ' https://pssoft.cl/influenzaAviarrest/getRubroColor'//,
      //{ headers: headers }
    );

  }
  async getLocalEstablecimientosSipec(regionId) {
    if (this.verSipec == true) {
      var data = await this.storage.get("establecimientosAves");
      var dataA = data || [];
      var elCheckiado = false;
      this.listas = [];
      this.listaCheckRubro.forEach(async element => {

        var checkbox = document.getElementById(element.idCheck);
        var ch = checkbox.getAttribute('class');
        if (ch == 'md interactive hydrated checkbox-checked') {
          elCheckiado = true;
          var o = {
            rubro: element.rubro,
            check: true
          }
          this.listas.push(o);
        } else {
          elCheckiado = false;
          var o = {
            rubro: element.rubro,
            check: false
          }
          this.listas.push(o);
        }
      });
      const selecc = this.listas.filter((f) => f.check == true);
      var seleccA = selecc || [];
      if (seleccA.length > 0) {
        dataA = dataA.filter((elemento) =>
          seleccA.some((filtro) => filtro.rubro == elemento.properties.rubro)
        );
      }
      await this.limpiarLocalEstablecimientosSipec();
      //por TIpoEstab
      const selecTE = this.listasTipoEstab.filter((f) => f.check == true);
      var seleccARTE = selecTE || [];
      if (selecTE.length > 0) {
        dataA = dataA.filter((elemento) =>
          seleccARTE.some((filtro) => filtro.idTipoEstab == elemento.properties.tipoEstabId)
        );
      }
      //por REGION
      const selecR = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecR || [];
      dataA = dataA.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.regionId)
      );

    //  dataA = dataA.filter( (f) => f.properties.malGeo == 1)
      

      var fil = dataA.filter(f => f == f);
      await this.printGeoJsonCirculos(fil);
    }
  }
  //#endregion
  //#region SSA
  async clasificacionesSanitariaBD() {
    this.storage.set('clasificacionSanitaria', [])
    var dataEst = await this.storage.get("establecimientosAves");
    var dataA = dataEst || [];
    // console.log(dataA)
    const xL = await this.cargando("Espere, cargando clasificaciones sanitarias SSA");
    this.getClasificacionSanitaria().subscribe(async (resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API DATASET ssa= " + ss);
      const dataJ = JSON.parse(ss);
      this.jsonConcat = [];
      const radioRupBd = await this.storage.get('radioRup')
      var radioR = radioRupBd || 1;

      dataJ.forEach(async z => {
        //IR A BUSCAR LATI Y LONG DESDE LOCAL BD ESTABLECIMIENTO

        var estab = dataA.filter((f) => f.properties.rup == z.Rup);
        if (estab.length > 0) {
          var lalo = estab[0].geometry.coordinates || [];
          var latitudN = parseFloat(lalo[1]);
          var longitudN = parseFloat(lalo[0]);
          var tipoEstabId = estab[0].properties.tipoEstabId;
          var tipoEstab = estab[0].properties.tipoEstab;
          var rubroId = estab[0].properties.rubroId;
          var rubro = estab[0].properties.rubro;

          //LOGICA POSITIVO Y NEGATIVO
          var radioClas = 1;
          var color = 'black';
          var weight = 1;
          var fillOpacity = 0.3;
          if (z.TipoClasificacionId == 8) {
            //positivo
            //2 radios dependiendo del tipoEstab
            if (tipoEstabId == 151) {
              //PLANTEL SE APLICAN LOS 3 KM Y 7 KK; 

              //PRIMERA CAPA SON LOS 7KM PERO PARA EFECTOS DE LA APP SON 10 KM ENCIMA IRA LA DE 3KM
              radioClas = 10000;
              color = '#FE2907';
              weight = 1;
              fillOpacity = 0.3;
              var jso = await this.radioGeoJsonClasificacionSanitaria(latitudN, longitudN, radioClas, color, z.TipoClasificacionId, z.Clasificacion,
                z.Especie, z.Enfermedad, z.MedidasSanitarias,
                z.FechaClasificacion, z.Rup, z.RegionId,
                tipoEstabId, tipoEstab, rubroId, rubro, weight, fillOpacity);
              //console.log(JSON.stringify(jso));
              this.jsonConcat.push(jso);

              radioClas = 3000;
              color = 'red';
              weight = 2;
              fillOpacity = 0.4;
              var jso2 = await this.radioGeoJsonClasificacionSanitaria(latitudN, longitudN, radioClas, color, z.TipoClasificacionId, z.Clasificacion,
                z.Especie, z.Enfermedad, z.MedidasSanitarias,
                z.FechaClasificacion, z.Rup, z.RegionId,
                tipoEstabId, tipoEstab, rubroId, rubro, weight, fillOpacity);
              //console.log(JSON.stringify(jso));
              this.jsonConcat.push(jso2);
            } else {
              //PRIMERA CAPA SON LOS 3KM PERO PARA EFECTOS DE LA APP SON 3 KM ENCIMA IRA LA DE 1KM
              radioClas = 3000;
              color = '#FE2907';
              weight = 1;
              fillOpacity = 0.3;
              var jso = await this.radioGeoJsonClasificacionSanitaria(latitudN, longitudN, radioClas, color, z.TipoClasificacionId, z.Clasificacion,
                z.Especie, z.Enfermedad, z.MedidasSanitarias,
                z.FechaClasificacion, z.Rup, z.RegionId,
                tipoEstabId, tipoEstab, rubroId, rubro, weight, fillOpacity);
              //console.log(JSON.stringify(jso));
              this.jsonConcat.push(jso);

              radioClas = 1000;
              color = 'red';
              weight = 2;
              fillOpacity = 0.4;
              var jso2 = await this.radioGeoJsonClasificacionSanitaria(latitudN, longitudN, radioClas, color, z.TipoClasificacionId, z.Clasificacion,
                z.Especie, z.Enfermedad, z.MedidasSanitarias,
                z.FechaClasificacion, z.Rup, z.RegionId,
                tipoEstabId, tipoEstab, rubroId, rubro, weight, fillOpacity);
              //console.log(JSON.stringify(jso));
              this.jsonConcat.push(jso2);
            }
          } else {
            weight = 2;
            fillOpacity = 0.7;
            radioClas = radioR + 1;
            color = '#00FF59';
            var jso = await this.radioGeoJsonClasificacionSanitaria(latitudN, longitudN, radioClas, color, z.TipoClasificacionId, z.Clasificacion,
              z.Especie, z.Enfermedad, z.MedidasSanitarias,
              z.FechaClasificacion, z.Rup, z.RegionId,
              tipoEstabId, tipoEstab, rubroId, rubro, weight, fillOpacity);
            console.log(JSON.stringify(jso));
            this.jsonConcat.push(jso);
          }
        }
      });

      console.log(this.jsonConcat)
      this.storage.set('clasificacionSanitaria', this.jsonConcat)

      this.clasificacionSanitaLabel = "Con Datos"

      this.loading.dismiss();

    });
  }
  getClasificacionSanitaria() {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://sinaptest.sag.gob.cl/api/apilab/ObtenerVistaClasificacionSanitaria'// + regionId + ''//,

      //{ headers: headers }
    );
  }
  async getLocalClasificacionSanitariaSSA() {

    if (this.verClasificacionesSSA == true) {

      var data = await this.storage.get("clasificacionSanitaria");
      var dataA = data || [];

      if (this.conTipoEstab == true) {
        //por rubro
        this.listas = [];
        this.listaCheckRubro.forEach(async element => {

          var checkbox = document.getElementById(element.idCheck);
          var ch = checkbox.getAttribute('class');
          if (ch == 'md interactive hydrated checkbox-checked') {

            var o = {
              rubro: element.rubro,
              check: true
            }
            this.listas.push(o);
          } else {

            var o = {
              rubro: element.rubro,
              check: false
            }
            this.listas.push(o);
          }
        });
        const selecc = this.listas.filter((f) => f.check == true);
        var seleccA = selecc || [];
        if (seleccA.length > 0) {
          dataA = dataA.filter((elemento) =>
            seleccA.some((filtro) => filtro.rubro == elemento.properties.rubro)
          );
        }
        //por TIpoEstab
        const selecTE = this.listasTipoEstab.filter((f) => f.check == true);
        var seleccARTE = selecTE || [];
        if (selecTE.length > 0) {
          dataA = dataA.filter((elemento) =>
            seleccARTE.some((filtro) => filtro.idTipoEstab == elemento.properties.tipoEstabId)
          );
        }
      }
      //POR TIPO DE CLASIFICACION
      if (this.clasPositivo == true && this.clasNegativo == false) {
        dataA = dataA.filter((e) => e.properties.clasificacionId == 8)
      }
      if (this.clasPositivo == false && this.clasNegativo == true) {
        dataA = dataA.filter((e) => e.properties.clasificacionId == 2)
      }
      await this.limpiarLocalClasificacionSanitariaSSA();

      //por REGION
      const selecR = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecR || [];
      dataA = dataA.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.regionId)
      );
      var fil = dataA.filter(f => f == f);
      await this.printGeoJsonCirculosClasSa(fil);
    }
  }

  async resultadosBD(regionId) {
    var nombTabla = 'resultados_' + regionId;
    this.storage.set(nombTabla, [])
    var dataEst = await this.storage.get("establecimientosAves");
    var dataA = dataEst || [];
    // console.log(dataA)
    const xL = await this.cargando("Espere, cargando resultados x región SSA");
    try {
      this.getResultados(regionId).subscribe((resp) => {
        let ss = JSON.stringify(resp, null, 4);
        console.log("respuesta API DATASET ssa= " + ss);
        const dataJ = JSON.parse(ss);
        this.storage.set(nombTabla, dataJ)
        this.iniciarRegionesList();
        this.loading.dismiss();
      });
    } catch {
      this.presentToast("Error al obtener datos de resultados")
      this.loading.dismiss();
    }

  }
  getResultados(regionId) {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://sinaptest.sag.gob.cl/api/apilab/ObtenerGestionAnalisis?regionId=' + regionId + ''//,

      //{ headers: headers }
    );
  }

  async vigilanciaSSABD() {
    this.storage.set('vigilanciaSSA', [])
    var dataEst = await this.storage.get("establecimientosAves");
    var dataA = dataEst || [];
    // console.log(dataA)
    const xL = await this.cargando("Espere, cargando vigilancia SSA");
    this.getVigilanciaSSA().subscribe(async (resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API DATASET ssa= " + ss);
      const dataJ = JSON.parse(ss);
      this.jsonConcat = [];

      dataJ.forEach(async z => {
        //IR A BUSCAR LATI Y LONG DESDE LOCAL BD ESTABLECIMIENTO
        var estab = dataA.filter((f) => f.properties.rup == z.Rup);
        if (estab.length > 0) {
          var lalo = estab[0].geometry.coordinates || [];
          var latitudN = parseFloat(lalo[1]);
          var longitudN = parseFloat(lalo[0]);
          var tipoEstabId = estab[0].properties.tipoEstabId;
          var tipoEstab = estab[0].properties.tipoEstab;
          var rubroId = estab[0].properties.rubroId;
          var rubro = estab[0].properties.rubro;

          var color = 'black';
          var radio = 10;

          var jso = await this.radioGeoJsonVigilancia(latitudN, longitudN,
            radio, color, z.RegionId,
            z.Rup, tipoEstabId,
            tipoEstab, rubroId, rubro, z.FechaCreacion,
            z.ProtocoloId, z.CantidadAnalisis);
          //console.log(JSON.stringify(jso));
          this.jsonConcat.push(jso);

        }

      });

      console.log(this.jsonConcat)
      this.storage.set('vigilanciaSSA', this.jsonConcat)

      this.vigilanciaSSALabel = "Con Datos"

      this.loading.dismiss();

    });
  }
  getVigilanciaSSA() {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://sinaptest.sag.gob.cl/api/apilab/ObtenerVigilanciaResumen?c=0'// + regionId + ''//,

      //{ headers: headers }
    );
  }
  async getLocalVigilanciaSSA(fecha, fechaPrint) {

    if (this.verVigilanciaSSA == true) {

      var data = await this.storage.get("vigilanciaSSA");
      var dataA = data || [];

      dataA = dataA.filter((e) => e.properties.fechaTM == fecha);

      if (this.conTipoEstab == true) {
        //por rubro
        this.listas = [];
        this.listaCheckRubro.forEach(async element => {

          var checkbox = document.getElementById(element.idCheck);
          var ch = checkbox.getAttribute('class');
          if (ch == 'md interactive hydrated checkbox-checked') {

            var o = {
              rubro: element.rubro,
              check: true
            }
            this.listas.push(o);
          } else {

            var o = {
              rubro: element.rubro,
              check: false
            }
            this.listas.push(o);
          }
        });
        const selecc = this.listas.filter((f) => f.check == true);
        var seleccA = selecc || [];
        if (seleccA.length > 0) {
          dataA = dataA.filter((elemento) =>
            seleccA.some((filtro) => filtro.rubro == elemento.properties.rubro)
          );
        }
        //por TIpoEstab
        const selecTE = this.listasTipoEstab.filter((f) => f.check == true);
        var seleccARTE = selecTE || [];
        if (selecTE.length > 0) {
          dataA = dataA.filter((elemento) =>
            seleccARTE.some((filtro) => filtro.idTipoEstab == elemento.properties.tipoEstabId)
          );
        }
      }
      //POR TIPO DE CLASIFICACION
      if (this.clasPositivo == true && this.clasNegativo == false) {
        dataA = dataA.filter((e) => e.properties.clasificacionId == 8)
      }
      if (this.clasPositivo == false && this.clasNegativo == true) {
        dataA = dataA.filter((e) => e.properties.clasificacionId == 2)
      }


      //por REGION
      const selecR = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecR || [];
      dataA = dataA.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.regionId)
      );
      var fil = dataA.filter(f => f == f);
      if (this.contadorGlobalLineaTiempoVSsa == 0 || this.contadorGlobalLineaTiempoVSsa == 2) {
        if (dataA.length > 0) {
          const divElement = document.getElementById(fechaPrint);
          divElement.className = 'sinAccion';
          this.fechaTomaMuestraLabel = await fecha;
        } else {
          const divElement = document.getElementById(fechaPrint);
          divElement.className = 'cuboDiaNow';
        }

        await this.printGeoJsonCirculosVigilanciaSSA(fil);
      }
    }
  }
  async getLineaTiempoVigilanciaSSA() {
    if (this.verVigilanciaSSA == true) {
      this.lineaTiempoVigilanciaSSA = [];

      var data = await this.storage.get("vigilanciaSSA");
      var dataA = data || [];

      const groupedData = dataA.reduce((result, e) => {
        const daT = e.properties.fechaTM.split(' ');
        const fe = daT[0].split('-');
        const dia = fe[0];
        const mes = fe[1];
        const anio = fe[2];

        const date = daT[0];
        if (!result[date]) {
          result[date] = [];
          console.log(date)
          var ob = {
            fechaReal: e.properties.fechaTM,
            fechaprint: date
          }
          this.lineaTiempoVigilanciaSSA.push(ob);
        }
        result[date].push(e);
        return result;
      }, {});
      //  console.log(this.lineaTiempoVigilanciaSSA)

    }
  }
  //#endregion
  //#endregion
  //#region ZONA GEOMETRICA
  //#region Guardar Figura Geometrica
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
  //#endregion
  //#region geometriaBD ZONAS
  async geometricaBD(app) {

    const xL = await this.cargando("Espere, cargando zonas ");
    this.getZonas().subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);
      var myLines = [];
      var myMultiLines = [];
      var flag = 0;
      var arrCr = []
      dataJ.zonas.forEach(async z => {
        console.log(z.TipoGeometria)
        if (z.TipoGeometria == "MultiPolygon") {
          var co = JSON.parse(z.JsonPoligono)
          var data = {
            "type": "MultiPolygon",
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
          await myMultiLines.push(data);
        } else {
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
            await myLines.push(data);
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
        }

      });
      // console.log(JSON.stringify(myLines))
      Leaflet.geoJson(myLines, {
        // onEachFeature: function (feature, layer) {
        //   // var htmls = "<p> Zona =  " + feature.properties.name + "</p>"
        //   // htmls += "<p> Lugar = " + feature.properties.lugar + "</p>"
        //   // htmls += "<p> Comuna = " + feature.properties.comuna + "</p>"

        //   // layer.bindPopup('',
        //     // { noHide: true, closeButton: false })
        //     // .on("popupopen", (a) => {
        //     //   // app.idZona = feature.properties.id
        //     //   // app.estadoActualZona = feature.properties.vigente
        //     //   // app.nombreZonaTool = feature.properties.name
        //     //   // app.nombreLugarTool = feature.properties.lugar
        //     // })
        //   //IF SI ESTA ABIERTA O NO LA ZONA Y SE PONE EL COLOR
        //   // var color2 = "#ff7800";
        //   // if (feature.properties.vigente == 1) {
        //   //   //VIGENTE ZONA INFECTADA
        //   //   color2 = "#B40404";

        //   // } else {
        //   //   //NO VIGENTE LIBRE
        //   //   color2 = "#0B610B";
        //   // }
        //   // layer.setStyle({
        //   //   // "fillColor": color2,
        //   //   "color": '#0B610B',
        //   //   "weight": 1,
        //   //   "opacity": 1,
        //   //   "fillOpacity": 0.2
        //   // });
        // }

      }).addTo(this.map);
      console.log(JSON.stringify(myMultiLines))
      Leaflet.geoJSON(myMultiLines, {
        // onEachFeature: function (feature, layer) {
        //   // var htmls = "<p> Zona =  " + feature.properties.name + "</p>"
        //   // htmls += "<p> Lugar = " + feature.properties.lugar + "</p>"
        //   // htmls += "<p> Comuna = " + feature.properties.comuna + "</p>"

        //   // layer.bindPopup('',
        //     // { noHide: true, closeButton: false })
        //     // .on("popupopen", (a) => {
        //     //   // app.idZona = feature.properties.id
        //     //   // app.estadoActualZona = feature.properties.vigente
        //     //   // app.nombreZonaTool = feature.properties.name
        //     //   // app.nombreLugarTool = feature.properties.lugar
        //     // })
        //   //IF SI ESTA ABIERTA O NO LA ZONA Y SE PONE EL COLOR
        //   // var color2 = "#ff7800";
        //   // if (feature.properties.vigente == 1) {
        //   //   //VIGENTE ZONA INFECTADA
        //   //   color2 = "#B40404";

        //   // } else {
        //   //   //NO VIGENTE LIBRE
        //   //   color2 = "#0B610B";
        //   // }
        //   // layer.setStyle({
        //   //   // "fillColor": color2,
        //   //   "color": '#0B610B',
        //   //   "weight": 1,
        //   //   "opacity": 1,
        //   //   "fillOpacity": 0.2
        //   // });
        // }

      }).addTo(this.map);
      this.loading.dismiss();
    });
  }
  getZonas() {
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getZonas'//,

      //{ headers: headers }
    );
  }
  //#endregion
  //#region ShapeRegiones
  async getRegionShapeGeoJson() {
    this.storage.set('regionPolygon', [])
    this.storage.set('regionMultipolygon', [])
    const xL = await this.cargando("Espere, cargando regiones ");
    this.http.get('assets/geoJsones/region2.geojson').subscribe(data => {
      let jsonData = JSON.parse(JSON.stringify(data));
      console.log(jsonData.features); // esto mostrará el objeto JavaScript en la consola
      var myLines = [];
      var myMultiLines = [];
      var flag = 0;
      var arrCr = []
      jsonData.features.forEach(async z => {
        // console.log(z.geometry.type)
        if (z.geometry.type == "MultiPolygon") {

          var data = {
            "type": "MultiPolygon",
            "properties": {
              "region": z.properties.Region,
              "codRegion": z.properties.codregion
            },
            "coordinates": z.geometry.coordinates
          }
          // console.log(JSON.stringify(data))
          await myMultiLines.push(data);
        } else {
          if (z.geometry.type == "Polygon") {

            // console.log(co);
            var data = {
              "type": "Polygon",
              "properties": {
                "region": z.properties.Region,
                "codRegion": z.properties.codregion
              },
              "coordinates": z.geometry.coordinates
            }
            // console.log(JSON.stringify(data))
            await myLines.push(data);
          }
        }

      });

      //  console.log(JSON.stringify(myLines))
      this.storage.set('regionPolygon', myLines)
      this.storage.set('regionMultipolygon', myMultiLines)

      this.regionesLabel = "Con Datos"

      this.loading.dismiss();
    });
  }
  async getLocalRegionShapeGeoJson() {

    if (this.verRegiones == true) {

      const dataJP = await this.storage.get('regionPolygon')
      var dataJOP = dataJP || [];
      const dataJMP = await this.storage.get('regionMultipolygon')
      var dataJOMP = dataJMP || [];

      await this.limpiarLocalRegionesShape();

      //por REGION  X Polygon
      const selecRP = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecRP || [];
      dataJOP = dataJOP.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.codRegion)
      );
      var filP = dataJOP.filter(f => f == f);
      //await this.printGeoJsonCirculosClasSa(fil);

      //por REGION  X Multipolygon
      const selecRMP = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecRMP || [];
      dataJOMP = dataJOMP.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.codRegion)
      );
      var filMP = dataJOMP.filter(f => f == f);
      // await this.printGeoJsonCirculosClasSa(fil);



      var geoP = Leaflet.geoJson(filP, {
        style: {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.0,
          color: '#610B4B'
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.region);
        }

      }).addTo(this.map);
      this.arrayLeafletRegionesP.push(geoP);
      // console.log(JSON.stringify(myMultiLines))
      var geoMP = Leaflet.geoJSON(filMP, {
        style: {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.0,
          color: '#610B4B'
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.region);
        }

      }).addTo(this.map);
      this.arrayLeafletRegionesMP.push(geoMP);
    }
  }
  async limpiarLocalRegionesShape() {
    this.arrayLeafletRegionesP.forEach(element => {
      this.map.removeLayer(element);
    });
    this.arrayLeafletRegionesMP.forEach(element => {
      this.map.removeLayer(element);
    });
  }
  //#endregion
  //#region ShapeProvincias
  async getProvinciaShapeGeoJson() {
    this.storage.set('provinciaPolygon', [])
    this.storage.set('provinciaMultipolygon', [])
    const xL = await this.cargando("Espere, cargando provincias ");
    this.http.get('assets/geoJsones/provincia.geojson').subscribe(data => {
      let jsonData = JSON.parse(JSON.stringify(data));
      console.log(jsonData.features); // esto mostrará el objeto JavaScript en la consola
      var myLines = [];
      var myMultiLines = [];
      var flag = 0;
      var arrCr = []
      jsonData.features.forEach(async z => {
        // console.log(z.geometry.type)
        if (z.geometry.type == "MultiPolygon") {

          var data = {
            "type": "MultiPolygon",
            "properties": {
              "provincia": z.properties.Provincia,
              "region": z.properties.Region,
              "codRegion": z.properties.codregion
            },
            "coordinates": z.geometry.coordinates
          }
          // console.log(JSON.stringify(data))
          await myMultiLines.push(data);
        } else {
          if (z.geometry.type == "Polygon") {

            // console.log(co);
            var data = {
              "type": "Polygon",
              "properties": {
                "provincia": z.properties.Provincia,
                "region": z.properties.Region,
                "codRegion": z.properties.codregion
              },
              "coordinates": z.geometry.coordinates
            }
            // console.log(JSON.stringify(data))
            await myLines.push(data);
          }
        }

      });

      this.storage.set('provinciaPolygon', myLines)
      this.storage.set('provinciaMultipolygon', myMultiLines)
      this.provinciaLabel = "Con Datos"
      this.loading.dismiss();
    });
  }
  async getLocalProvinciaShapeGeoJson() {

    if (this.verProvincias == true) {

      const dataJP = await this.storage.get('provinciaPolygon')
      var dataJOP = dataJP || [];
      const dataJMP = await this.storage.get('provinciaMultipolygon')
      var dataJOMP = dataJMP || [];

      await this.limpiarLocalProvinciasShape();

      //por REGION  X Polygon
      const selecRP = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecRP || [];
      dataJOP = dataJOP.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.codRegion)
      );
      var filP = dataJOP.filter(f => f == f);
      //await this.printGeoJsonCirculosClasSa(fil);

      //por REGION  X Multipolygon
      const selecRMP = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecRMP || [];
      dataJOMP = dataJOMP.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.codRegion)
      );
      var filMP = dataJOMP.filter(f => f == f);
      // await this.printGeoJsonCirculosClasSa(fil);



      var geoP = Leaflet.geoJson(filP, {
        style: {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.0,
          color: 'blue'
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.provincia);
        }

      }).addTo(this.map);
      this.arrayLeafletProvinciasP.push(geoP);
      // console.log(JSON.stringify(myMultiLines))
      var geoMP = Leaflet.geoJSON(filMP, {
        style: {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.0,
          color: 'blue'
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.provincia);
        }

      }).addTo(this.map);
      this.arrayLeafletProvinciasMP.push(geoMP);
    }
  }
  async limpiarLocalProvinciasShape() {
    this.arrayLeafletProvinciasP.forEach(element => {
      this.map.removeLayer(element);
    });
    this.arrayLeafletProvinciasMP.forEach(element => {
      this.map.removeLayer(element);
    });
  }
  //#endregion
  //#region ShapeComunas
  async getComunaShapeGeoJson() {
    this.storage.set('comunaPolygon', [])
    this.storage.set('comunaMultipolygon', [])
    const xL = await this.cargando("Espere, cargando comunas ");
    this.http.get('assets/geoJsones/comuna.geojson').subscribe(data => {
      let jsonData = JSON.parse(JSON.stringify(data));
      console.log(jsonData.features); // esto mostrará el objeto JavaScript en la consola
      var myLines = [];
      var myMultiLines = [];
      var flag = 0;
      var arrCr = []
      jsonData.features.forEach(async z => {
        // console.log(z.geometry.type)
        if (z.geometry.type == "MultiPolygon") {

          var data = {
            "type": "MultiPolygon",
            "properties": {
              "comuna": z.properties.Comuna,
              "region": z.properties.Region,
              "codRegion": z.properties.codregion
            },
            "coordinates": z.geometry.coordinates
          }
          // console.log(JSON.stringify(data))
          await myMultiLines.push(data);
        } else {
          if (z.geometry.type == "Polygon") {

            // console.log(co);
            var data = {
              "type": "Polygon",
              "properties": {
                "comuna": z.properties.Comuna,
                "region": z.properties.Region,
                "codRegion": z.properties.codregion
              },
              "coordinates": z.geometry.coordinates
            }
            // console.log(JSON.stringify(data))
            await myLines.push(data);
          }
        }

      });
      this.storage.set('comunaPolygon', myLines)
      this.storage.set('comunaMultipolygon', myMultiLines)
      this.comunaLabel = "Con Datos"
      this.loading.dismiss();
    });
  }
  async getLocalComunaShapeGeoJson() {

    if (this.verComunas == true) {

      const dataJP = await this.storage.get('comunaPolygon')
      var dataJOP = dataJP || [];
      const dataJMP = await this.storage.get('comunaMultipolygon')
      var dataJOMP = dataJMP || [];

      await this.limpiarLocalcomunasShape();

      //por REGION  X Polygon
      const selecRP = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecRP || [];
      dataJOP = dataJOP.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.codRegion)
      );
      var filP = dataJOP.filter(f => f == f);
      //await this.printGeoJsonCirculosClasSa(fil);

      //por REGION  X Multipolygon
      const selecRMP = this.listasRegiones.filter((f) => f.check == true);
      var seleccAR = selecRMP || [];
      dataJOMP = dataJOMP.filter((elemento) =>
        seleccAR.some((filtro) => filtro.regionId == elemento.properties.codRegion)
      );
      var filMP = dataJOMP.filter(f => f == f);
      // await this.printGeoJsonCirculosClasSa(fil);



      var geoP = Leaflet.geoJson(filP, {
        style: {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.0,
          color: 'red'
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.comuna);
        }


      }).addTo(this.map);
      this.arrayLeafletComunasP.push(geoP);
      // console.log(JSON.stringify(myMultiLines))
      var geoMP = Leaflet.geoJSON(filMP, {
        style: {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.0,
          color: 'red'
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.comuna);
        }
      }).addTo(this.map);
      this.arrayLeafletComunasMP.push(geoMP);
    }
  }
  async limpiarLocalcomunasShape() {
    this.arrayLeafletComunasP.forEach(element => {
      this.map.removeLayer(element);
    });
    this.arrayLeafletComunasMP.forEach(element => {
      this.map.removeLayer(element);
    });
  }
  //#endregion
  //#region ShapeSantuariosNaturales
  async getSantuariosNaturalesShapeGeoJson() {
    const xL = await this.cargando("Espere, cargando santuarios naturales ");
    this.http.get('assets/geoJsones/cuerpoagua.geojson').subscribe(data => {
      let jsonData = JSON.parse(JSON.stringify(data));
      console.log(jsonData.features); // esto mostrará el objeto JavaScript en la consola
      var myLines = [];
      var myMultiLines = [];
      var flag = 0;
      var arrCr = []
      jsonData.features.forEach(async z => {
        // console.log(z.geometry.type)
        if (z.geometry.type == "MultiPolygon") {

          var data = {
            "type": "MultiPolygon",
            "properties": {
              "tipoSnap": z.properties.Tipo_Snasp,
              "nombre": z.properties.Nombre
            },
            "coordinates": z.geometry.coordinates
          }
          // console.log(JSON.stringify(data))
          await myMultiLines.push(data);
        } else {
          if (z.geometry.type == "Polygon") {

            // console.log(co);
            var data = {
              "type": "Polygon",
              "properties": {
                "tipoSnap": z.properties.Tipo_Snasp,
                "nombre": z.properties.Nombre
              },
              "coordinates": z.geometry.coordinates
            }
            // console.log(JSON.stringify(data))
            await myLines.push(data);
          }
        }

      });
      // console.log(JSON.stringify(myLines))
      Leaflet.geoJson(myLines, {
        weight: 1.4,
        opacity: 1,
        fillOpacity: 0.1,
        color: 'green'

      }).addTo(this.map);
      // console.log(JSON.stringify(myMultiLines))
      Leaflet.geoJSON(myMultiLines, {
        weight: 1.4,
        opacity: 1,
        fillOpacity: 0.1,
        color: 'green'

      }).addTo(this.map);
      this.loading.dismiss();
    });
  }
  //#endregion
  //#endregion
  //#region  METODOS GENERICOS LEAFLET
  //#region Metodos Genericos
  async volar(latlong, zoom) {
    this.map.flyTo(latlong, zoom, { animate: true, duration: 3 });
    setTimeout(function () { }, 3000);
  }
  async intercepcionesPredios(a, element, deQueModulo) {
    const xL = await this.cargando("Espere, buscando predios...");
    var arrayRupdentroRadio = [];
    var data = await this.storage.get("clasificacionSanitaria");
    var dataAS = data || [];
    for (let i = 0; i < this.arrayLeafletRupGeo.length; i++) {
      let capaCirculo = this.arrayLeafletRupGeo[i];
      let myLayers = capaCirculo._layers;
      // Verificar si el círculo se encuentra en el área deseada
      try {
        if (capaCirculo.getBounds().intersects(a.target.getBounds())) {
          var myFeatures = [];
          for (var layerId in myLayers) {
            var layer = myLayers[layerId];
            if (layer && layer.feature) { // Verifica si la capa existe y tiene una propiedad feature
              myFeatures.push(layer.feature);
            }
          }
          // console.log(myFeatures[0].properties.rup);´
          //ir a buscar la clasificacion sanitaria del rup
          var clasificacionSanitariaActualForm = "";
          var especieForm = "";
          var enfermedadForm = "";
          var medidasSanitariasForm = "";
          var fechaClasificacionForm = "";
          var rupFilSC = dataAS.filter((f) => f.properties.rup == myFeatures[0].properties.rup);

          if (rupFilSC.length > 0) {
            clasificacionSanitariaActualForm = rupFilSC[0].properties.clasificacion;
            especieForm = rupFilSC[0].properties.especie;
            enfermedadForm = rupFilSC[0].properties.enfermedad;
            medidasSanitariasForm = rupFilSC[0].properties.medidasSanitarias;
            fechaClasificacionForm = rupFilSC[0].properties.fechaClasificacion;
          } else {
            clasificacionSanitariaActualForm = "Sin clasificación sanitaria"
            especieForm = "";
            enfermedadForm = "";
            medidasSanitariasForm = "";
            fechaClasificacionForm = "";
          }
          var ojb = {
            rup: myFeatures[0].properties.rup,
            tipoEstab: myFeatures[0].properties.tipoEstab,
            rubro: myFeatures[0].properties.rubro,
            clasificacionSanitariaActualForm: clasificacionSanitariaActualForm,
            especieForm: especieForm,
            enfermedadForm: enfermedadForm,
            medidasSanitariasForm: medidasSanitariasForm,
            fechaClasificacionForm: fechaClasificacionForm,
            longitud: myFeatures[0].geometry.coordinates[0],
            latitud: myFeatures[0].geometry.coordinates[1],
            x: myFeatures[0].properties.x,
            y: myFeatures[0].properties.y,
            huso: myFeatures[0].properties.huso,
            oficina: myFeatures[0].properties.oficinaId
          }
          arrayRupdentroRadio.push(ojb);
        }
      } catch {

      }

    }
    this.loading.dismiss();
    if (deQueModulo == "printGeoJsonCirculosClasSa") {
      await this.setDataPopupRup(element.properties.rup, arrayRupdentroRadio);
      this.mostrarDivFlotante = true;
      //ADD OPCION ELIMINAR
    } else {
      if (deQueModulo == "inicioMapa") {
        if (arrayRupdentroRadio.length > 0) {
          this.contieneRupsEncontrados = true;
          this.listadoRupsEncontrados = arrayRupdentroRadio;
        }
        else {
          this.contieneRupsEncontrados = false;
        }
        this.mostrarDivFlotanteSel = true;
      }
    }

  }
  //#endregion
  //#region CAPA SIPEC
  async printGeoJsonCirculos(geojsonFeature) {
    const radioRupBd = await this.storage.get('radioRup')
    var radioR = radioRupBd || 1;

    geojsonFeature.forEach(element => {
      var geojsonMarkerOptions = {
        radius: radioR,
        fillColor: element.properties.fillColor,
        color: element.properties.color,
        propiedades: element.properties,
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      };

      var goe = Leaflet.geoJSON(element, {
        pointToLayer: function (feature, latlng) {
          return Leaflet.circle(latlng, geojsonMarkerOptions);
        }
      }).addTo(this.map)
        .on("click", async (a) => {
          //  console.log(element.properties.rup);

          await this.setDataPopupRup(element.properties.rup, []);
          this.mostrarDivFlotante = true;
        })
      this.arrayLeafletRupGeo.push(goe);
    });
  }
  async limpiarLocalEstablecimientosSipec() {
    this.arrayLeafletRupGeo.forEach(element => {
      this.map.removeLayer(element);
    });
  }
  //#endregion
  //#region CAPA ClasificacionSanitaria
  async printGeoJsonCirculosClasSa(geojsonFeature) {

    geojsonFeature.forEach(element => {
      var geojsonMarkerOptions = {
        radius: element.properties.radius,
        fillColor: element.properties.fillColor,
        color: element.properties.color,
        propiedades: element.properties,
        weight: element.properties.weight,
        opacity: element.properties.opacity,
        fillOpacity: element.properties.fillOpacity
      };

      var goe = Leaflet.geoJSON(element, {
        pointToLayer: function (feature, latlng) {
          return Leaflet.circle(latlng, geojsonMarkerOptions);
        }
      }).addTo(this.map)
        .on("click", async (a) => {
          //  console.log(this.arrayLeafletRupGeo)
          this.intercepcionesPredios(a, element, 'printGeoJsonCirculosClasSa');
        })


      this.arrayLeafletClasificacionSSAGeo.push(goe);
    });
  }
  async limpiarLocalClasificacionSanitariaSSA() {
    this.arrayLeafletClasificacionSSAGeo.forEach(element => {
      this.map.removeLayer(element);
    });
  }
  //#endregion
  //#region CAPA VigilanciaSSA
  async printGeoJsonCirculosVigilanciaSSA(geojsonFeature) {
    const radioRupBd = await this.storage.get('radioRup')
    var radioR = radioRupBd || 1;
    radioR = radioR + 10;

    geojsonFeature.forEach(element => {
      var geojsonMarkerOptions = {
        radius: radioR,
        fillColor: element.properties.fillColor,
        color: 'blue',//element.properties.color,
        propiedades: element.properties,
        weight: 3,
        opacity: element.properties.opacity,
        fillOpacity: 0//element.properties.fillOpacity
      };

      var goe = Leaflet.geoJSON(element, {
        pointToLayer: function (feature, latlng) {
          return Leaflet.circle(latlng, geojsonMarkerOptions);
        }
      }).addTo(this.map)
        .on("click", async (a) => {
          //  console.log(this.arrayLeafletRupGeo)

        })


      this.arrayLeafletVigilanciaSSAGeo.push(goe);
    });
  }
  async limpiarLocalVigilanciaSSA() {
    this.arrayLeafletVigilanciaSSAGeo.forEach(element => {
      this.map.removeLayer(element);
    });
  }
  //#endregion
  //#region ESTRUCTURAS GEOJSON 
  async radioGeoJson(latitudN, longitudN, radio, color, regionId, rupIn, tipoEstabId,
    tipoEstab, rubroId, rubro, oficinaId, x, y, huso,malGeo) {
    var obj = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitudN, latitudN]
      },
      properties: {
        regionId: regionId,
        rup: rupIn,
        tipoEstabId: tipoEstabId,
        tipoEstab: tipoEstab,
        rubroId: rubroId,
        rubro: rubro,
        oficinaId: oficinaId,
        x: x,
        y: y,
        huso: huso,
        malGeo:malGeo,
        subType: "Circle",
        radius: radio,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
      }
    }
    //  console.log(obj);
    return obj;
  }
  async radioGeoJsonClasificacionSanitaria(latitudN, longitudN, radio,
    color, clasificacionId, clasificacion, especie, enfermedad,
    medidasSanitarias, fechaClasificacion, rupIn, regionId,
    tipoEstabId, tipoEstab, rubroId, rubro, weight, fillOpacity) {
    var obj = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitudN, latitudN]
      },
      properties: {
        regionId: regionId,
        rup: rupIn,
        clasificacionId: clasificacionId,
        clasificacion: clasificacion,
        especie: especie,
        enfermedad: enfermedad,
        medidasSanitarias: medidasSanitarias,
        fechaClasificacion: fechaClasificacion,
        tipoEstabId: tipoEstabId,
        tipoEstab: tipoEstab,
        rubroId: rubroId,
        rubro: rubro,
        subType: "Circle",
        radius: radio,
        fillColor: color,
        color: color,
        weight: weight,
        opacity: 1,
        fillOpacity: fillOpacity
      }
    }
    //  console.log(obj);
    return obj;
  }
  async radioGeoJsonVigilancia(latitudN, longitudN, radio, color, regionId, rupIn, tipoEstabId,
    tipoEstab, rubroId, rubro, fechaTM, protocoloId, cantidadAnalisis) {
    var obj = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitudN, latitudN]
      },
      properties: {
        regionId: regionId,
        rup: rupIn,
        tipoEstabId: tipoEstabId,
        tipoEstab: tipoEstab,
        rubroId: rubroId,
        rubro: rubro,
        fechaTM: fechaTM,
        protocoloId: protocoloId,
        cantidadAnalisis: cantidadAnalisis,
        subType: "Circle",
        radius: radio,
        fillColor: color,
        color: color,
        weight: 3,
        opacity: 1,
        fillOpacity: 0.0
      }
    }
    //  console.log(obj);
    return obj;
  }
  //#endregion
  //#endregion
}

