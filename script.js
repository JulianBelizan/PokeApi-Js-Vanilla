const lists__pokemons = document.getElementById('lists__pokemons');
let urlPokemon = 'https://pokeapi.co/api/v2/pokemon';
let templateHtml;

const getPokemons = async(url) =>{
    try {
        const response = await fetch(url);
        const results = await response.json();
       DataPokemons(results.results)
    } catch (error) {
        console.log("Error#1")
    }
}



getPokemons(urlPokemon);

const DataPokemons = async(data) =>{
    lists__pokemons.innerHTML ='';
    try {
        for(let index of data) {
            const resp = await fetch(index.url);
            const result = await resp.json();
            console.log(result);
            templateHtml = `
            <div class="tarjeta">
                <h2>${result.name} #${result.id.toString().padStart(3,0)}</h2>
                <div class="contenedor-imagen">
                    <img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${result.id}.png' alt=${result.name}/>
                </div>
                <div class='tipos'>
                    <p class='tipo' id='${result.types[0].type.name}'>${result.types[0].type.name}</p>
                </div>
            </div>
            `
            lists__pokemons.innerHTML+=templateHtml
        }
    } catch (error) {
        console.log("Error#2")
    }
}