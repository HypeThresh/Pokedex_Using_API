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
  const contenedorPokemon = document.getElementById('pokedex-container');

  // Método privado para crear una tarjeta HTML de Pokémon
  function crearTarjetaPokemon(pokemon) {
    const tarjeta = document.createElement('div');
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

    // Agrega la tarjeta al contenedor en tu página
    contenedorPokemon.appendChild(tarjeta);
  }

  // Método público para dibujar el Pokedex
  function dibujarPokedex() {
    // Llama a obtenerDatosPokemon para varios Pokémon
    for (let i = 1; i <= 150; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Crear un objeto Pokemon con los datos
          const pokemon = new Pokemon(data);
          // Llama al método privado para crear la tarjeta HTML
          crearTarjetaPokemon(pokemon);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  // Devuelve solo el método público
  return {
    dibujarPokedex: dibujarPokedex
  };
})();

// Llama al método público para dibujar el Pokedex
Pokedex.dibujarPokedex();
