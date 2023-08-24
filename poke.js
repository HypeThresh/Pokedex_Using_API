const apiKey = 'TU_CLAVE_DE_API';
const pokemonId = 1; // Cambia esto al ID del Pokémon que deseas obtener

fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
})
  .then(response => response.json())
  .then(data => {
    // Aquí puedes procesar los datos del Pokémon
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
