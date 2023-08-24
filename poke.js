const apiKey = 'TU_CLAVE_DE_API';
function obtenerDatosPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Aquí tienes los datos del Pokémon, como el nombre, tipo, habilidades, etc.
        console.log(data);
        // Llama a una función para crear una tarjeta HTML con estos datos.
        crearTarjetaPokemon(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function crearTarjetaPokemon(data) {
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('pokemon-card'); // Agrega una clase CSS para dar estilo a la tarjeta

  const nombre = document.createElement('h2');
  nombre.textContent = data.name;

  const tipo = document.createElement('p');
  tipo.textContent = `Tipo: ${data.types[0].type.name}`;

  const habilidades = document.createElement('p');
  habilidades.textContent = `Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;

  // Agrega más información según tus necesidades, como imagen, estadísticas, etc.

  tarjeta.appendChild(nombre);
  tarjeta.appendChild(tipo);
  tarjeta.appendChild(habilidades);

  // Agrega la tarjeta al contenedor en tu página
  const contenedorPokemon = document.getElementById('pokedex-container');
  contenedorPokemon.appendChild(tarjeta);
}

// Llama a obtenerDatosPokemon para varios Pokémon
obtenerDatosPokemon(1); // Pikachu
obtenerDatosPokemon(4); // Charmander
obtenerDatosPokemon(7); // Squirtle
// Agrega más Pokémon según sea necesario
