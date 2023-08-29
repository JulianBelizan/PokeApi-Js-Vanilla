const lists__pokemons = document.getElementById("lists__pokemons");
let urlPokemon = "https://pokeapi.co/api/v2/pokemon";
let templateHtml;

let totalPokemons = 0;

const getPokemons = async (url) => {
  try {
    const response = await fetch(url);
    const results = await response.json();
    totalPokemons = results.count;
    DataPokemons(results.results);
  } catch (error) {
    console.log("Error#1");
  }
};

getPokemons(urlPokemon);

const DataPokemons = async (data) => {
  lists__pokemons.innerHTML = "";
  try {
    for (let index of data) {
      const resp = await fetch(index.url);
      const result = await resp.json();

      // Crear un objeto con la información del Pokémon
      const pokemonInfo = {
        name: result.name,
        id: result.id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.id}.png`,
        type: result.types[0].type.name,
        description: "Descripción del Pokémon", // Agrega la descripción real si la tienes
      };

      // Convierte el objeto en una cadena JSON y escapa las comillas para usarla como atributo de datos
      const pokemonInfoStr = JSON.stringify(pokemonInfo).replace(
        /"/g,
        "&quot;"
      );

      templateHtml = `
                <div class="tarjeta" data-pokemon-info='${pokemonInfoStr}'>
                    <h2>${result.name} #${result.id.toString().padStart(3, 0)}</h2>
                    <div class="contenedor-imagen">
                        <img src='${pokemonInfo.image}' alt=${result.name}/>
                    </div>
                    <div class='tipos'>
                        <p class='tipo' id='${result.types[0].type.name}'>${result.types[0].type.name}</p>
                    </div>
                </div>
            `;

      lists__pokemons.innerHTML += templateHtml;
    }

    
    const modal = document.getElementById("pokemonModal");
    const closeBtn = document.querySelector(".close");
    const pokemonName = document.getElementById("modalPokemonName");
    const pokemonImage = document.getElementById("modalPokemonImage");
    const pokemonDescription = document.getElementById("modalPokemonDescription");
    const healthValue = document.getElementById("healthValue");
    const attackValue = document.getElementById("attackValue");
    const defenseValue = document.getElementById("defenseValue");

    // Agrega un evento de clic a cada tarjeta para mostrar el modal
    document.querySelectorAll(".tarjeta").forEach((card) => {
        card.addEventListener("click", async () => {
          const pokemonInfoStr = card.getAttribute("data-pokemon-info");
          const { name, image, description, id} = JSON.parse(pokemonInfoStr);
      
          // Obtén los detalles del Pokémon desde la API
          try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
              const pokemonData = await response.json();
              console.log(pokemonData)
      
            // Obtén la salud, ataque y defensa del Pokémon
            const health = pokemonData.stats.find(
              (stat) => stat.stat.name === "hp"
            ).base_stat;
            const attack = pokemonData.stats.find(
              (stat) => stat.stat.name === "attack"
            ).base_stat;
            const defense = pokemonData.stats.find(
              (stat) => stat.stat.name === "defense"
            ).base_stat;
      
            // Actualiza el contenido del modal con los detalles
            pokemonName.textContent = name;
            pokemonImage.src = image;
            pokemonDescription.textContent = description;
            healthValue.textContent = health;
            attackValue.textContent = attack;
            defenseValue.textContent = defense;
      
            // Muestra el modal
            modal.style.display = "block";
          } catch (error) {
            console.error("Error al obtener los detalles del Pokémon:", error);
          }
        });
      });
      
      // Agrega un evento de clic para cerrar el modal
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
      
      // Cierra el modal haciendo clic fuera del contenido
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      });
  } catch (error) {
    console.log("Error#2");
  }
};

let currentPage = 1;

document.getElementById("next-button").addEventListener("click", () => {
  currentPage++;
  const newUrl = `${urlPokemon}?offset=${(currentPage - 1) * 20}`;
  getPokemons(newUrl);
});

document.getElementById("prev-button").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    const newUrl = `${urlPokemon}?offset=${(currentPage - 1) * 20}`;
    getPokemons(newUrl);
  }
});

const apiUrl = "https://pokeapi.co/api/v2/type/";

// Función para obtener la lista de tipos de Pokémon
const getPokemonTypes = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const types = data.results.map((type) => type.name);
    return types;
  } catch (error) {
    console.error("Error al obtener los tipos de Pokémon:", error);
    return [];
  }
};

document.getElementById("first-button").addEventListener("click", () => {
  currentPage = 1; // Ir al principio
  const newUrl = `${urlPokemon}?offset=0`;
  getPokemons(newUrl);
});

document.getElementById("last-button").addEventListener("click", () => {
  // Calcular la última página
  const lastPage = Math.ceil(totalPokemons / 20);
  currentPage = lastPage; // Ir al final
  const newUrl = `${urlPokemon}?offset=${(lastPage - 1) * 20}`;
  getPokemons(newUrl);
});
