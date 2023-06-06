import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-power-bi',
  templateUrl: './power-bi.page.html',
  styleUrls: ['./power-bi.page.scss'],
})
export class PowerBiPage implements OnInit {
  logeado: boolean = false;
  vinculadoSag: boolean = false;
  nombreUsuarioLogeado: string = "";
  perfiles:string = "";

  //perfiles 
  objetoPerfiles: any = {};
  constructor(private storage: Storage) { }
  
  async ngOnInit() {
    
    const token = await this.storage.get("token");
    const nombreUsuario = await this.storage.get("nombreUsuario")
    const perfiles = await this.storage.get("perfiles")
    console.log(perfiles);
    if (token != undefined && token != null && token != "[]") {
      console.log("HAY ALGUIEN");
      this.nombreUsuarioLogeado = nombreUsuario;
      var jDa = perfiles
      console.log(jDa);
      this.objetoPerfiles = JSON.parse(jDa);
      this.perfiles = this.objetoPerfiles.Roles;
      this.logeado = true;
    } else {
      console.log("NO LOGEADO")
      this.perfiles = "{}";
      this.nombreUsuarioLogeado = "";
      this.logeado = false;
    }
  }
  async ngAfterViewInit() {
    
   
  }

}
