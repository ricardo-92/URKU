import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];

  constructor( private http: HttpClient) {

    this.cargarProductos();
  }
  private cargarProductos() {

    return new Promise<void>( ( resolve, reject ) => {
      this.http.get<Producto[]>('https://urku-html-default-rtdb.firebaseio.com/productos_idx.json')
        .subscribe( (resp: Producto[]) => {
          this.productos = resp;
          setTimeout(() => {
            this.cargando = false;
          }, 2000);
          resolve();
        });
    });
  }

  getProducto( id: string ) {

    return this.http.get(`https://urku-html-default-rtdb.firebaseio.com/productos/${ id }.json`);
  }

  buscarProducto( termino: string ) {

    if ( this.productos.length === 0) {
      // Cargar productos
      this.cargarProductos().then( () => {
      // Ejecutar después de tener los productos
      // Aplicar filtro
      this.filtrarProductos( termino );
      });
    } else {
      // Aplicar filtro
      this.filtrarProductos( termino );
    }
  }

    private filtrarProductos( termino: string ) {

      // console.log(this.productos);
      this.productosFiltrado = [];

      termino = termino.toLocaleLowerCase();

      this.productos.forEach( prod => {

        const tituloLower = prod.titulo?.toLocaleLowerCase();

        if( prod.categoria !== undefined && prod.categoria.indexOf( termino ) >= 0 || tituloLower !== undefined && tituloLower.indexOf( termino ) >= 0) {
          this.productosFiltrado.push( prod );
        }

      });

    }

}
