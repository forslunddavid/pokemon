// ta bort alert och prompt

//klicka på en pokemon i sökresultat lägga till den i my team samt välja namn. max 3 i my team, resten ska hamna i reserver

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

const searchButton = document.querySelector('#search-button');

const searchBar = document.querySelector('#search-bar');

const searchResultsContainer = document.getElementById("search-results-container");

//My Team konstanter
const startingTeam = document.querySelector('.starting-team');
const reserves = document.querySelector('.reserves');

const startingTeamContainer = document.querySelector(".starting-team");
const reserveTeamContainer = document.querySelector(".reserve-team");

const pokemonData = {};


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

// Function to add a pokemon to the starting team or reserves
function addPokemonToTeam(pokemonName) {
  // Create a new div to hold the pokemon
	const newPokemonDiv = document.createElement('div');
	newPokemonDiv.innerText = pokemonName;

  // Check if there is room in the starting team
	if (startingTeam.children.length < 3) {
    startingTeam.appendChild(newPokemonDiv);
	} else {
    reserves.appendChild(newPokemonDiv);
	}
}

// Function to display search results
function displaySearchResults(results) {
  // Clear previous results
	searchResults.innerHTML = '';

  // Loop through results and create a button for each pokemon
	results.forEach(result => {
    const pokemonName = result.name;
    const newButton = document.createElement('button');
    newButton.innerText = pokemonName;
    newButton.addEventListener('click', () => {
      // Prompt the user for a name to use for the pokemon
    	const newName = prompt('Enter a name for this pokemon:');
    	if (newName) {
        pokemonData[newName] = result;
        addPokemonToTeam(newName);
    	}
    });
    searchResults.appendChild(newButton);
	});
}

// Function to search for pokemon
async function searchPokemon() {
	const searchTerm = searchBar.value.toLowerCase();
	if (pokemonData[searchTerm]) {
    addPokemonToTeam(searchTerm);
	} else {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
    if (response.ok) {
    	const data = await response.json();
    	pokemonData[searchTerm] = data;
    	addPokemonToTeam(searchTerm);
    } else {
    	alert(`No pokemon found with name '${searchTerm}'`);
    }
	}
	searchBar.value = '';
searchResults.innerHTML = '';
}

searchButton.addEventListener('click', searchPokemon);

function createPokemonCard(pokemon) {
	const card = document.createElement("div");
	card.classList.add("card");

	const cardBody = document.createElement("div");
	cardBody.classList.add("card-body");

	const cardTitle = document.createElement("h5");
	cardTitle.classList.add("card-title");
	cardTitle.textContent = pokemon.name;

	const addButton = document.createElement("button");
	addButton.classList.add("btn", "btn-primary");
	addButton.textContent = "Add to Team";
	addButton.addEventListener("click", () => {
    const pokemonName = prompt("Enter a name for your Pokemon:");
    if (pokemonName) {
    	const teamCount = startingTeamContainer.childElementCount;
    	if (teamCount < 3) {
        const pokemonCard = createPokemonCard(pokemon);
        const nameElement = pokemonCard.querySelector(".card-title");
        nameElement.textContent = `${pokemonName} (${pokemon.name})`;
        startingTeamContainer.appendChild(pokemonCard);
    	} else {
        const pokemonCard = createPokemonCard(pokemon);
        const nameElement = pokemonCard.querySelector(".card-title");
        nameElement.textContent = `${pokemonName} (${pokemon.name})`;
        reserveTeamContainer.appendChild(pokemonCard);
    	}
    }
	});

	cardBody.appendChild(cardTitle);
	cardBody.appendChild(addButton);
	card.appendChild(cardBody);

	return card;
}