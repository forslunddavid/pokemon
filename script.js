const pokeUrl = 'https://pokeapi.co/'

//Knappkonstanter

const pokedexButton = document.getElementById("pokedex-button");
const myTeamButton = document.getElementById("my-team-button");

const pokedexHomeButton = document.getElementById("pokedex-home-button");
const pokedexMyTeamButton = document.getElementById("pokedex-my-team-button");
const myTeamHomeButton = document.getElementById("my-team-home-button");
const myTeamPokedexButton = document.getElementById("my-team-pokedex-button");

const pokedexOverlay = document.getElementById("pokedex-overlay");
const myTeamOverlay = document.getElementById("my-team-overlay");

// Sökkonstanter

const searchInput = document.getElementById("search-input");

const searchForm = document.getElementById("search-form");

const searchResults = document.getElementById("search-results");


// Eventlisteners knappar

pokedexButton.addEventListener("click", function(){
	pokedexOverlay.classList.add("show");
	myTeamOverlay.classList.remove("show");
});

myTeamButton.addEventListener("click", function(){
	myTeamOverlay.classList.add("show");
	pokedexOverlay.classList.remove("show");
});

pokedexHomeButton.addEventListener("click", function(){
	pokedexOverlay.classList.remove("show");
	console.log("Pokedex Home Button Clicked");
});

myTeamHomeButton.addEventListener("click", function(){
	myTeamOverlay.classList.remove("show");
	console.log("My Team Home Button Clicked");
});

pokedexMyTeamButton.addEventListener("click", function(){
	pokedexOverlay.classList.remove("show");
	myTeamOverlay.classList.add("show");
});

myTeamPokedexButton.addEventListener("click", function(){
	myTeamOverlay.classList.remove("show");
	pokedexOverlay.classList.add("show");
});

//Eventlisteners sökfält

searchForm.addEventListener("submit", function(event) {
	event.preventDefault(); // prevent form submission

	const searchTerm = searchInput.value;
	const searchUrl = `${pokeUrl}api/v2/pokemon/${searchTerm}`;

	fetch(searchUrl)
		.then(response => response.json())
		.then(data => {
			const pokemon = {
				id: data.id,
				name: data.name,
				image: data.sprites.front_default,
				types: data.types.map(type => type.type.name)
			};
			const resultHtml = `
				<div>
					<img src="${pokemon.image}" alt="${pokemon.name}">
					<h3>${pokemon.name}</h3>
					<p>Types: ${pokemon.types.join(", ")}</p>
				</div>
			`;
			searchResults.innerHTML = resultHtml;
		})
		.catch(error => {
			searchResults.innerHTML = "<p>No results found</p>";
		});
});


searchInput.addEventListener("keyup", function() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length >= 3) {
        fetch(`${pokeUrl}api/v2/pokemon/?limit=1118`)
            .then(response => response.json())
            .then(data => {
                const matchingPokemon = data.results.filter(pokemon => pokemon.name.includes(searchTerm));
                let resultHtml = "";
                if (matchingPokemon.length > 0) {
                    matchingPokemon.forEach(pokemon => {
                        fetch(pokemon.url)
                            .then(response => response.json())
                            .then(data => {
                                const pokemonInfo = {
                                    id: data.id,
                                    name: data.name,
                                    image: data.sprites.front_default,
                                    types: data.types.map(type => type.type.name)
                                };
                                resultHtml += `
                                    <div>
                                        <img src="${pokemonInfo.image}" alt="${pokemonInfo.name}">
                                        <h3>${pokemonInfo.name}</h3>
                                        <p>Types: ${pokemonInfo.types.join(", ")}</p>
                                    </div>
                                `;
                                searchResults.innerHTML = resultHtml;
                            });
                    });
                } else {
                    searchResults.innerHTML = "<p>No results found</p>";
                }
            })
            .catch(error => {
                searchResults.innerHTML = "<p>No results found</p>";
            });
    } else {
        searchResults.innerHTML = "";
    }
});

//klicka på en pokemon i sökresultat lägga till den i my team samt välja namn. max 3 i my team, resten ska hamna i reserver