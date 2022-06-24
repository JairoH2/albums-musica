/*:::::::: Variables :::::::::::*/
const contenedorAlbums = document.querySelector('#row__albums');
const main = document.querySelector('#main');
const rowsSelect = document.querySelectorAll(".row__select");
const cantidadProductos = document.querySelector("#carrito__number");
const selectTitle = document.querySelectorAll(".select__title");
const elementFilterArtist = document.querySelectorAll(".nombre__lista__option__artista");
const elementFilterFecha = document.querySelectorAll(".nombre__lista__option__fecha");
const elementFilterPais = document.querySelectorAll(".nombre__lista__option__pais");
const cantidadFiltros = document.querySelector("#mensajes__filtros__cantidad");
const historialFiltros = document.querySelector("#mensajes__filtros__historial");


// Activar Modal para filtros
const filtroIconos = document.querySelectorAll("#filter__icon");
const rowFilter = document.querySelector("#row__filter");
const modal = document.querySelector("#modal");

//Seleccionar filtros
const filtroMenu = document.querySelector("#menu__filter")
const nombre = document.querySelectorAll(".nombre__lista__option")
const btnFiltrar = document.querySelector('#btn__enviar__filter');

//Aún en prueba para ejecutar los filtros al llegar al mediaquery
var mediaqueryList = window.matchMedia("(min-width: 992px)");

//Datos para la busqueda
const datosBusqueda = {
    artista: '',
    fecha: '',
    pais: ''
}


//Definir el source de la bandera de acuerdo al país
const datoPais = {
    banderaPais: "",
    descripcionPais: "",
}


//Obtener de Local Storage los productos de carrito
const albumsPreviosCarrito = JSON.parse(localStorage.getItem('albumsCarrito'));


/*:::::::: Event Listeners :::::::::::*/

//Mostrar Albums
document.addEventListener('DOMContentLoaded', ()=>{
    //Cargar si existen productos agregdos previamente
    if(albumsPreviosCarrito){
        albumsCarrito = [...albumsPreviosCarrito];
    }

    mostrarCantidadProductos();

    mostrarAlbums(albums);
})

//click en menu de filtros
main.addEventListener('click', mostrarMenuFiltro);

//Click en elemento de lista
main.addEventListener('click', mostrarElementosFiltro);

//Filtrar Resultados
btnFiltrar.addEventListener('click', confirmarFiltro);



//Agregar eventos a cada una de las opciones
nombre.forEach( (elemento) => {
    elemento.addEventListener('click', agregarDatosBusqueda);
});

//Agregar elemento al carrito cuando se presiona en "Comprar"
contenedorAlbums.addEventListener('click', agregarAlbum);

/*:::::::: Funciones :::::::::::*/

//Mostrar menú
function mostrarMenuFiltro(e){
    if(e.target.classList.contains("filter__title") || e.target.classList.contains("filter__icon") ){

        filtroIconos.forEach(icono =>{ //Muestra el icono de cancelar o filtrar de acuerdo al que tenga la clase acive
            icono.classList.toggle("active");
        })
        
        filtroMenu.classList.toggle("active"); //visualizar el menu de opciones a filtrar
        modal.classList.toggle("active"); //Activar la ventana modal
        rowFilter.classList.toggle("active"); //Superponer los iconos de filtrar sobre la ventana modal
    }
}

//Mostrar elementos de cada opcion del filtro
function mostrarElementosFiltro(e){
    if(e.target.classList.contains("select__title")){
        const rowSelect = e.target.parentElement;
        const arrowActive = e.target;

        rowsSelect.forEach((row, indice) =>{
            row.classList.remove("active");
            selectTitle[indice].classList.remove("active"); //Quitar el active de las flechas tengan
        })

        arrowActive.classList.toggle("active"); //Agregar active la flecha que corresponda al titulo
        rowSelect.classList.toggle("active");
    }
}

//Desplegar lista de albums
function mostrarAlbums(albums){
    //Limpiar html
    limpiarHTML();
    
    //Construir html de autos
    albums.forEach(album =>{

        const albumHTML = document.createElement('DIV');
        albumHTML.classList.add("album");

        switch(album.pais){
            case "Argentina":
                datoPais.banderaPais = "img/argentina.png";
                datoPais.descripcionPais = "bandera de Argentina";
                break;
            case "España":
                datoPais.banderaPais = "img/españa.png";
                datoPais.descripcionPais = "bandera de España";
                break;
            case "Estados Unidos":
                datoPais.banderaPais = "img/estadosunidos.png";
                datoPais.descripcionPais = "bandera de Estados Unidos";
                break;
            case "México":
                datoPais.banderaPais = "img/mexico.png";
                datoPais.descripcionPais = "bandera de México";
                break;
            case "Venezuela":
                datoPais.banderaPais = "img/venezuela.png";
                datoPais.descripcionPais = "bandera de Venezuela";
                break;
            default:
                break;
        }

        albumHTML.innerHTML = `
            <img src="img/${album.img}" alt="" class="album__imagen">
            <div class="album__container__info">
                <p class="album__titulo">${album.album}</p>
                <div class="album__info__artista">
                    <div>
                        <p class="album__artista__nombre">${album.artista}</p>
                        <img src="${datoPais.banderaPais}" alt="${datoPais.descripcionPais}" class="album__artista__pais">
                    </div>
                    <p class="album__precio">$<span>100</span></p>
                </div>
                <p class="album__info__year">${album.fecha} / ${album.canciones} canciones</p>
                <button class="btn__agregar__carrito" data-id="${album.id}">Comprar</button>
            </div>
        `;

        contenedorAlbums.appendChild(albumHTML);
    })

    //Actualizar cantidad de productos e historial de búsqueda
    mostrarFiltros(albums);
}

//Funcion Agregar opciones selecionadas a datosBusqueda

function agregarDatosBusqueda(e){
    const titulo = e.target.parentElement.previousElementSibling.getAttribute('data-title');
    const valor = e.target.innerText;
    const selectValor = e.target;

    if(titulo === 'artista'){

        if(valor === "Ninguno"){
            datosBusqueda.artista = "";
        } else{
            datosBusqueda.artista = valor;
        }

        elementFilterArtist.forEach(elemento =>{
            elemento.classList.remove("active");
        })
        selectValor.classList.toggle("active");


        //Ejecutar los filtros al llegar al mediaquery 992px
        if(mediaqueryList.matches){
            filtrarAlbum();
        }

    } else if( titulo === 'fecha'){

        if(valor === "Ninguno"){
            datosBusqueda.fecha = "";
        } else{
            datosBusqueda.fecha = valor;
        }

        elementFilterFecha.forEach(elemento =>{
            elemento.classList.remove("active");
        })
        selectValor.classList.toggle("active");

        //Aún en prueba para ejecutar los filtros al llegar al mediaquery
        if(mediaqueryList.matches){
            filtrarAlbum() 
        }
        
    } else{

        if(valor === "Ninguno"){
            datosBusqueda.pais = "";
        } else{
            datosBusqueda.pais = valor;
        }
        
        elementFilterPais.forEach(elemento =>{
            elemento.classList.remove("active");
        })
        selectValor.classList.toggle("active");

        //Aún en prueba para ejecutar los filtros al llegar al mediaquery
        if(mediaqueryList.matches){
            filtrarAlbum() 
        }
    }
}


//Limpiar HTML
function limpiarHTML(){

    //Limpitar resultados previos
    while(contenedorAlbums.firstChild){
        contenedorAlbums.removeChild(contenedorAlbums.firstChild);
    }

}

//Confirmar opciones a filtrar
function confirmarFiltro(e){
    filtrarAlbum();

    filtroIconos.forEach(icono =>{ //Muestra el icono de cancelar o filtrar de acuerdo al que tenga la clase acive
        icono.classList.toggle("active");
    });

    filtroMenu.classList.toggle("active"); //Permite visualizar el menu de opciones a filtrar
    modal.classList.toggle("active"); //Activar la ventana modal
    rowFilter.classList.toggle("active"); //Superponer los iconos de filtrar sobre la ventana modal
}


//Filtrar resultados

function filtrarAlbum(){
    const resultado = albums.filter(filtrarArtista).filter(filtrarFecha).filter(filtrarPais);
    
    //Imprimir HTML con los datos filtrados
    if(resultado.length){
        mostrarAlbums(resultado);
    } else{
        noCoincidencias(resultado);
    }
}

function filtrarArtista(album){
    if(datosBusqueda.artista){
        return album.artista === datosBusqueda.artista;
    }
    return album;
}

function filtrarFecha(album){
    if(datosBusqueda.fecha){
        //Convierto el tipo de dato para que sea string
        return album.fecha.toString() === datosBusqueda.fecha;
    }
    return album;
}

function filtrarPais(album){
    if(datosBusqueda.pais){
        return album.pais === datosBusqueda.pais;
    }
    return album;
}

//No se econtraron concicidencias en el filtro

function noCoincidencias(resultado){
    limpiarHTML();

    const mensaje = document.createElement('DIV');
    mensaje.textContent = 'No se encontraron coincidencias.';
    mensaje.classList.add("no__coincidencias");

    contenedorAlbums.appendChild(mensaje);

    //Actualizar lista de filtros de productos
    mostrarFiltros(resultado);
}

//Mostrar información las opciones seleccionadas en los filtros
function mostrarFiltros(resultado){
    
    cantidadFiltros.innerHTML =`Resultados encontrados (${resultado.length.toString()})`;

    historialFiltros.innerHTML=`
        ${datosBusqueda.artista ? `/${datosBusqueda.artista}` : ""}
        ${datosBusqueda.fecha ? `/${datosBusqueda.fecha}` : ""}
        ${datosBusqueda.pais ? `/${datosBusqueda.pais}` : ""}
    `;
}



//Agregar album al carrito
function agregarAlbum(e){
    if(e.target.classList.contains("btn__agregar__carrito")){
        const albumSeleccionado = e.target.parentElement.parentElement;

        //Pasamos a la funcion el curso seleccionado para tomar sus datos
        leerDatosAlbum(albumSeleccionado);
    }
}

//Leer datos de album seleccionado
function leerDatosAlbum(album){
    const datosAlbum = {
        nombre: album.querySelector('.album__titulo').textContent,
        id: album.querySelector('.btn__agregar__carrito').getAttribute('data-id'),
        imagen: album.querySelector('.album__imagen').src,
        precio: album.querySelector('.album__precio span').textContent,
        cantidad: 1
    }

    //Verificar si el album se ha agregado previamente.
    if(albumsCarrito.some(curso => curso.id === datosAlbum.id)){
        const albums = albumsCarrito.map( curso => {
            if(curso.id === datosAlbum.id) {
                //Suma la cantidad para ele elemento que ya se encuentre su id
                curso.cantidad++;
                return curso;
            }else{
                return curso;
            }
        });

        //Al agregar con spread operator se agregan los elementos internos del array.
        albumsCarrito = [...albums];
    } else{
        //En caso de que el id no se repita, se agrega como un elemento nuevo
        albumsCarrito = [...albumsCarrito, datosAlbum];
    }
        
    //Actualiza cantidad de productos en el carrito que se muestran
    mostrarCantidadProductos();

    //Actualiza local storage con el nuevo elemento
    const producto = JSON.stringify(albumsCarrito);
    localStorage.setItem('albumsCarrito', producto);
}

//Mostrar cantidad de productos
function mostrarCantidadProductos(){
    //Obtener cantidad de Productos Actual
    let cantidadProductosActual = albumsCarrito.reduce((valorAcumulado, valorActual)=> valorAcumulado + valorActual.cantidad, 0);

    //Mostrar Datos
    cantidadProductos.textContent = cantidadProductosActual;
}
