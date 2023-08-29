function Pokemon(data) {
  this.name = data.name;
  this.type = data.types[0].type.name;
  this.abilities = data.abilities.map(ability => ability.ability.name);
  this.image = data.sprites.front_default;

  // Crear un arreglo de promesas para obtener detalles de habilidades
  const abilityPromises = data.abilities.map(abilityData =>
    obtenerHabilidad(abilityData.ability.url)
  );

  // Esperar a que se completen todas las promesas
  Promise.all(abilityPromises)
    .then(abilities => {
      // Una vez que se completen todas las solicitudes de habilidades, agrega los nombres al objeto Pokemon
      this.abilities = abilities.map(ability => ability.name);
    })
    .catch(error => {
      console.error("Error al obtener habilidades:", error);
    });
}


// Función para obtener el nombre de una habilidad
async function obtenerHabilidad(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.name; // Devolvemos solo el nombre de la habilidad
}


// Módulo Pokedex
const Pokedex = (function () {
  // Contenedor donde se mostrarán las tarjetas de Pokémon
  const contenedorPokemon = document.getElementById('pokedex-container');
// Método privado para crear una tarjeta HTML de Pokémon
async function crearTarjetaPokemon(pokemon) {
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('pokemon-card');

  const nombre = document.createElement('h2');
  nombre.textContent = pokemon.name;

  const tipo = document.createElement('p');
  tipo.textContent = `Tipo: ${pokemon.type}`;

  const habilidades = document.createElement('p');
  habilidades.textContent = `Habilidades:`;

  // Agregar habilidades en líneas separadas
  pokemon.abilities.forEach(ability => {
    const habilidad = document.createElement('p');
    habilidad.textContent = ability;
    habilidades.appendChild(habilidad);
  });

  const imagen = document.createElement('img');
  imagen.src = pokemon.image;

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(nombre);
  tarjeta.appendChild(tipo);
  tarjeta.appendChild(habilidades);

  // Agrega la tarjeta al contenedor en tu página
  contenedorPokemon.appendChild(tarjeta);

  // Realiza una segunda solicitud para obtener información adicional
  const infoAdicional = await obtenerInfoAdicional(pokemon);
  tarjeta.appendChild(infoAdicional);
}


  // Función para obtener información adicional (especie, altura, peso)
async function obtenerInfoAdicional(pokemon) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo obtener información adicional para ${pokemon.name}`);
  }

  const data = await response.json();

  // Verificar si los datos necesarios están disponibles
  if (data && data.genera && data.genera.length > 0 && data.genera[0].genus) {
    const especie = data.genera[0].genus;
    const altura = pokemon.height / 10; // Convertir la altura a metros
    const peso = pokemon.weight / 10; // Convertir el peso a kilogramos

    const infoAdicional = document.createElement('p');
    infoAdicional.textContent = `Especie: ${especie}, Altura: ${altura} m, Peso: ${peso} kg`;

    return infoAdicional;
  } else {
    throw new Error(`Datos insuficientes para ${pokemon.name}`);
  }
}


  // Método público para dibujar el Pokedex
  async function dibujarPokedex(busq) {
    try {
      for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`No se pudo obtener el Pokémon ${i}`);
        }
  
        const data = await response.json();
  
        // Verificar búsqueda
        if (
          (busq === data.name.toLowerCase()) || // Búsqueda por nombre
          (data.types.find(typeData => busq === typeData.type.name.toLowerCase()) && data.types.length === 1) || // Búsqueda por tipo y el Pokémon solo tiene un tipo
          (busq === "") // Sin filtro, mostrar todos los Pokémon
        ) {
          // Crear un objeto Pokemon
          const pokemon = new Pokemon(data);
          await crearTarjetaPokemon(pokemon);
        }
      }
    } catch (error) {
      console.error("Error al obtener Pokémon:", error);
    }
  }
  
  

  // Limpiar contenedor
  function vaciarContenedor() {
    contenedorPokemon.innerHTML = ''; // Vacía el contenido del contenedor
  }

  // Devuelve solo el método público
  return {
    dibujarPokedex: dibujarPokedex,
    vaciarContenedor: vaciarContenedor
  };
})();

// Llama al método público para dibujar el Pokedex
Pokedex.dibujarPokedex("");

document.addEventListener("DOMContentLoaded", function () {
  var boton = document.getElementById("buscar");
  var inputBusq = document.getElementById("busq");

  boton.addEventListener("click", async function () {
    event.preventDefault();

    var valorBusqueda = inputBusq.value.trim().toLowerCase(); // Captura el valor ingresado, lo convierte a minúsculas y quita espacios en blanco

    // Deshabilita el botón de búsqueda durante la búsqueda
    boton.disabled = true;
    inputBusq.disabled = true;

    Pokedex.vaciarContenedor();
    await Pokedex.dibujarPokedex(valorBusqueda);

    // Habilita el botón de búsqueda después de que se completen los resultados
    boton.disabled = false;
    inputBusq.disabled = false;
  });

  inputBusq.addEventListener("input", async function () {
    var valorBusqueda = inputBusq.value.trim().toLowerCase(); // Captura el valor ingresado, lo convierte a minúsculas y quita espacios en blanco

    // Deshabilita el botón de búsqueda durante la búsqueda
    boton.disabled = true;

    Pokedex.vaciarContenedor();
    await Pokedex.dibujarPokedex(valorBusqueda);

    // Habilita el botón de búsqueda después de que se completen los resultados
    boton.disabled = false;
  });
});

