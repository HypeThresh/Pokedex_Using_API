// Objeto base Pokemon
function Pokemon(data) {
  this.name = data.name;
  this.type = data.types[0].type.name;
  this.abilities = data.abilities.map(ability => ability.ability.name);
  this.image = data.sprites.front_default;
}

// Módulo Pokedex
const Pokedex = (function () {
  // Contenedor donde se mostrarán las tarjetas de Pokémon
  const contenedorPokemon= document.getElementById('pokedex-container');
  const tiposPokemon = [
    "fire", "grass", "normal", "fighting", "flying", "poison",
    "ground", "rock", "bug", "ghost", "steel", "water",
    "electric", "psychic", "ice", "dragon", "dark", "fairy"
  ];

  const contenedoresTipos = {};

  tiposPokemon.forEach(tipo => {
    contenedoresTipos[tipo] = document.createElement('div');
  });
  

  // Método privado para crear una tarjeta HTML de Pokémon
  function crearTarjetaPokemon(pokemon) {
    const tarjeta = document.createElement('div');//tarjetas
    const contenedorTipo = document.createElement('div');//contenedores de tarjetas ordenados por tipos

    /////////////////////////////////creacion de tarjetas//////////////////////////////////////////////
    tarjeta.classList.add('pokemon-card'); // Agrega una clase CSS para dar estilo a la tarjeta

    const nombre = document.createElement('h2');
    nombre.textContent = pokemon.name;

    const tipo = document.createElement('p');
    tipo.textContent = `Tipo: ${pokemon.type}`;

    const habilidades = document.createElement('p');
    habilidades.textContent = `Habilidades: ${pokemon.abilities.join(', ')}`;

    const imagen = document.createElement('img');
    imagen.src = pokemon.image;


    // Agrega más información según tus necesidades, como imagen, estadísticas, etc.

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(tipo);
    tarjeta.appendChild(habilidades);

    /////////////////////////////////fin creacion de tarjetas//////////////////////////////////////////

    return tarjeta;
  }

  // Método público para dibujar el Pokedex
  function dibujarPokedex(busq) {
    vaciarContenedores()
    
    

    for (let i = 1; i <= 150; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
      fetch(url)
        .then(response => response.json())
        .then(data => {

            //verificar busqueda
            if(busq===data.name){
              // Crear un objeto Pokemon con la busqueda de nombre
              const pokemon = new Pokemon(data);  
              categorizarTarjetas(pokemon); 
            }else if(busq===data.types[0].type.name){
              // Crear un objeto Pokemon con la busqueda de tipo
              const pokemon = new Pokemon(data);  
              categorizarTarjetas(pokemon);
            }else if(busq===""){
              // Crear un objeto Pokemon 
              const pokemon = new Pokemon(data); 
              categorizarTarjetas(pokemon);
            }
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  //limpiar contenedor
function vaciarContenedor() {
  contenedorPokemon.innerHTML = ''; // Vacía el contenido del contenedor
}
  //limpiar contenedores de cada tipo
function vaciarContenedores(){
  for (const tipo in contenedoresTipos) {
    contenedoresTipos[tipo].innerHTML = '';
  }
}

//categorizar las tarjetas por tipos y mostrarlas
function categorizarTarjetas(pokemon){

    //agrega un scroll
    for (const tipo in contenedoresTipos) {
      contenedoresTipos[tipo].classList.add('scrollPokemon');
    }

    //filtrando y agregando por tipo
    for (const tipo in contenedoresTipos) {
      if (pokemon.type === tipo) {
        const tarjeta = crearTarjetaPokemon(pokemon);
        contenedoresTipos[tipo].appendChild(tarjeta);
      }
    }

    //agregando al contenedor principal

    for (const tipo in contenedoresTipos) {
        contenedorPokemon.appendChild(contenedoresTipos[tipo]);
    }
            

}



  // Devuelve solo el método público
  return {
    dibujarPokedex: dibujarPokedex,
    vaciarContenedor: vaciarContenedor
  };
})();

// Llama al método público para dibujar el Pokedex
Pokedex.dibujarPokedex("");

{}

//funcion del boton buscar
document.addEventListener("DOMContentLoaded", function(){

  var boton=document.getElementById("buscar");
  var inputBusq = document.getElementById("busq");

  boton.addEventListener("click", function(){
    event.preventDefault();

    var valorBusqueda = inputBusq.value; // Captura el valor ingresado


    Pokedex.vaciarContenedor();
    Pokedex.dibujarPokedex(valorBusqueda);
    
  });

})
