/*:::::::: VARIABLES :::::::::::*/
const rowCompras = document.querySelector('#row__compras');
const cantidadProductos = document.querySelector("#carrito__number");
const pagoAcumulado = document.querySelector("#envioResumen__pagoAcumulado");
const pagoTotal = document.querySelector("#envioResumen__pagoTotal");
const envioGratis = document.querySelector("#envioGratis");
const costoEnvio = document.querySelector("#envioResumen_costoEnvio");

//Verificar si existe el item en local storage
const verificarCarrito = JSON.parse(localStorage.getItem('albumsCarrito'));

//Se agvrega el resultado del item en localstorage o arreglo vacío por si no existe
var albumsListaCarrito = verificarCarrito ? verificarCarrito : [];

/*:::::::: EVENT LISTENERS :::::::::::*/
document.addEventListener('DOMContentLoaded', ()=>{
    //Mostrar los albums agregados al carrito
    mostrarProductosCarrito(albumsListaCarrito);

    //Mostrar cantidad de productos en el carrito
    mostrarCantidadProductos(albumsListaCarrito);

    //Mostrar Total a pagar
    totalPagar();
});


/*:::::::: FUNCIONES :::::::::::*/

//Mostrar los productos que se encuentran dentro del dom a mostrar
function mostrarProductosCarrito(albums){

    //Limpiar HTML
    limpiarHTML();

    if(albums.length){

        albums.forEach(elemento => {
            const article = document.createElement('article');
            article.classList.add('row__compra');
    
            article.innerHTML = `
                <img src="${elemento.imagen}" alt="" class="row__compra__img"/>
                <div class="compra__info">
                    <p>${elemento.nombre}</p>
                    <p>$${elemento.precio}</p>
                    <div class="compra__info__cantidad">
                        <div class="btn__compra__left"><i class="fa-solid fa-minus"></i></div>
                        <p>${elemento.cantidad}</p>
                        <div class="btn__compra__right"><i class="fa-solid fa-plus"></i></div>
                    </div>
                    <div class="compra__info__eliminar" data-id="${elemento.id}">
                     <button class="btn__eliminar__carrito">Eliminar</button>
                     <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>
            `
            rowCompras.appendChild(article);

            //Cargar eventlisteners dependientes de los elementos nuevos agregados
            eventListenersDependientes();
        });
    } else{
        const noAlbums = document.createElement("p");
        noAlbums.textContent = "No hay albums agregados al carrito";
        rowCompras.appendChild(noAlbums);
    }

}


//Mostrar cantidad de productos
function mostrarCantidadProductos(albumsListaCarrito){
    //Obtener cantidad de Productos Actual
    let cantidadProductosActual = albumsListaCarrito.reduce((valorAcumulado, valorActual)=> valorAcumulado + valorActual.cantidad, 0);

    //Mostrar Datos
    cantidadProductos.textContent = cantidadProductosActual;
}

//Restar Cantidad
function restarCantidad(e){
    if(e.target.classList.contains("fa-solid")){
        const idAlbumSeleccionado = (e.target.parentElement.parentElement.parentElement).querySelector('.compra__info__eliminar').getAttribute('data-id');
        const elementoActualizar = e.target.parentElement.nextElementSibling;

        restar(idAlbumSeleccionado, elementoActualizar);
    } else{
        const idAlbumSeleccionado2 = (e.target.parentElement.parentElement).querySelector('.compra__info__eliminar').getAttribute('data-id');
        const elementoActualizar2 = e.target.nextElementSibling;

        restar(idAlbumSeleccionado2, elementoActualizar2);
    }
}

function restar(album, elemento){
    if(elemento.textContent !== "0"){
        //Resta 1 a la cantidad
        let cantidadActualizada = parseInt(elemento.innerHTML)-1;
        elemento.textContent = cantidadActualizada.toString();

        //Actualizar cantidad en arreglo
        albumsListaCarrito.forEach(elemento =>{
            if(elemento.id === album){
                elemento.cantidad = cantidadActualizada;
            }
        });

        totalPagar();
        mostrarCantidadProductos(albumsListaCarrito);
        actualizarStorage();
    }
}

//Sumar Cantidad
function sumarCantidad(e){

    if(e.target.classList.contains("fa-solid")){
        const idAlbumSeleccionado = (e.target.parentElement.parentElement.parentElement).querySelector('.compra__info__eliminar').getAttribute('data-id');
        const elementoActualizar = e.target.parentElement.previousElementSibling;

        sumar(idAlbumSeleccionado, elementoActualizar);
    } else{
        const idAlbumSeleccionado2 = (e.target.parentElement.parentElement).querySelector('.compra__info__eliminar').getAttribute('data-id');
        const elementoActualizar2 = e.target.previousElementSibling;

        sumar(idAlbumSeleccionado2, elementoActualizar2);
    }
    
}

function sumar(album, elemento){
    //Resta 1 a la cantidad
    let cantidadActualizada = parseInt(elemento.innerHTML)+1;
    elemento.textContent = cantidadActualizada.toString();

    //Actualizar cantidad en arreglo
    albumsListaCarrito.forEach(elemento =>{
        if(elemento.id === album){
            elemento.cantidad = cantidadActualizada;
        }
    });

    totalPagar();
    mostrarCantidadProductos(albumsListaCarrito);
    actualizarStorage();
}

//Calcular total a pagar
function totalPagar(){
    let totalActual = albumsListaCarrito.reduce((acumulador, valorActual)=>{
        let precio = (parseInt(valorActual.precio))*valorActual.cantidad;
        return acumulador + precio; 
    }, 0);

    if(totalActual < 500){
        let valorGratis = 500 - totalActual; 
        envioGratis.textContent = (totalActual === 0 ? "Con una compra mayor a $500 el envío es gratis." : `Te hacen falta $${valorGratis} para obtener el envío gratis.`);
        costoEnvio.textContent = (totalActual === 0 ? "--" : "$200 MXN");
        pagoTotal.textContent = (totalActual+ (totalActual === 0 ? 0 : 200)).toString();
    } else{
        envioGratis.textContent = `Ahora ya tienes buena música y con envío ¡GRATIS! suena mejor.`;
        costoEnvio.textContent = "--";
        pagoTotal.textContent = totalActual.toString();
    }

    pagoAcumulado.textContent = totalActual.toString();
    
}

//Eliminar album de la lista
function eliminarAlbum(e){
    //Verificar que se pulsa sobre el el icono o boton
    if(e.target.classList.contains("fa-regular") || e.target.classList.contains("btn__eliminar__carrito")){
        const idEliminar = e.target.parentElement.getAttribute("data-id");
        
        albumsListaCarrito = albumsListaCarrito.filter(elemento => elemento.id !== idEliminar);
        
        mostrarProductosCarrito(albumsListaCarrito);

        //Mostrar la nueva cantidad de productos
        mostrarCantidadProductos(albumsListaCarrito);

        //Actualizar los costos a pagar
        totalPagar();

        //Actualizando el storage con los nuevos datos
        actualizarStorage();
    }
}

//Actualizat info de storage
function actualizarStorage(){
    localStorage.setItem('albumsCarrito', JSON.stringify(albumsListaCarrito));
}


//Limpiar el HTML
function limpiarHTML(){

    //Limpitar resultados previos
    while(rowCompras.firstChild){
        rowCompras.removeChild(rowCompras.firstChild);
    }

}


//Cargar event Listeners dependientes s
function eventListenersDependientes(){
        //Una vez obtenidos que los elementos existen en el dom se agregan los event listeners
        const btnProductLeft = document.querySelectorAll('.btn__compra__left');
        const btnProductRight = document.querySelectorAll('.btn__compra__right');
        const btnEliminar = document.querySelectorAll(".compra__info__eliminar");
    
        btnEliminar.forEach(element => {
            element.addEventListener('click', eliminarAlbum);
        });
    
        btnProductLeft.forEach((element, indice) =>{
            element.addEventListener('click', restarCantidad);
    
            //Aprovechando el ciclo para agregar listeners a el clicl derecho
            btnProductRight[indice].addEventListener('click', sumarCantidad);
    
        });
}