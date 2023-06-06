import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as $ from "jquery"

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  loading: HTMLIonLoadingElement;
  logeado: boolean = false;
  vinculadoSag: boolean = false;
  nombreUsuarioLogeado: string = "";
  perfiles: string = "";

  //perfiles 
  objetoPerfiles: any = {};

  //fin perfiles
  loginUser = {
    userName: "",
    password: "",
  };

  @ViewChild("frameSsa") frameSsa: ElementRef;

  constructor(private http: HttpClient,
    private toastController: ToastController,
    public loadingController: LoadingController,
    private storage: Storage) { }

  async ngOnInit() {


  }
  async logout() {
    await this.guardarIndexDB(undefined, '', '')
    this.nombreUsuarioLogeado = "";
    this.logeado = false;
    this.objetoPerfiles = '{}';
  }

  async ngAfterViewInit() {

    const token = await this.storage.get("token");
    const nombreUsuario = await this.storage.get("nombreUsuario")
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
    });
    await toast.present();
  }
  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }
  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async guardarIndexDB(token, nombreUsuario, perfiles) {
    await this.storage.set("token", token)
    await this.storage.set("nombreUsuario", nombreUsuario)
    await this.storage.set("perfiles", perfiles)
    this.nombreUsuarioLogeado = nombreUsuario;
    console.log("ROLES => " +perfiles)
    this.objetoPerfiles = perfiles;
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
                  
                  console.log("ROLES => " +usOb[0].Roles)
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

}
