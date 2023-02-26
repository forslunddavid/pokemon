//klicka på en pokemon i sökresultat lägga till den i my team samt välja namn. max 3 i my team, resten ska hamna i reserver

const pokeUrl = 'https://pokeapi.co/'

// Konstanter för knappar

const pokedexButton = document.getElementById("pokedex-button");
const myTeamButton = document.getElementById("my-team-button");

const pokedexHomeButton = document.getElementById("pokedex-home-button");
const pokedexMyTeamButton = document.getElementById("pokedex-my-team-button");
const myTeamHomeButton = document.getElementById("my-team-home-button");
const myTeamPokedexButton = document.getElementById("my-team-pokedex-button");

const pokedexOverlay = document.getElementById("pokedex-overlay");
const myTeamOverlay = document.getElementById("my-team-overlay");

// Konstanter för sökfältet

const searchInput = document.getElementById("search-input");

const searchForm = document.getElementById("search-form");

const searchResults = document.getElementById("search-results");

const searchBar = document.querySelector('#search-bar');

const searchResultsContainer = document.getElementById("search-results-container");

// Konstanter för laget

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
	event.preventDefault(); // förhindra att formuäret skickas i "förväg"

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
        fetch(`${pokeUrl}api/v2/pokemon/?limit=1279`)
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
    } else {
        searchResults.innerHTML = "";
    }
});

// Funktion för att lägga till en pokemon i startlaget eller reservlaget
function addPokemonToTeam(pokemonName) {
// Skapa en ny div för att hålla pokémonen
const newPokemonDiv = document.createElement('div');
newPokemonDiv.innerText = pokemonName;

// Kolla om det finns plats i startlaget
if (startingTeam.children.length < 3) {
startingTeam.appendChild(newPokemonDiv);
} else {
reserves.appendChild(newPokemonDiv);
}
}

// Eventlistener för sökresultat
searchResultsContainer.addEventListener('click', event => {
	const pokemonDiv = event.target.closest('.pokemon-result');
	if (!pokemonDiv) {
    return;
	}

	const pokemonName = pokemonDiv.dataset.name;
	addPokemonToTeam(pokemonName);
});

// Funktion för att visa sökresultat
function displaySearchResults(results) {
  // Rensa tidigare resultat
	searchResults.innerHTML = '';

  // Loopa genom resultaten och skapa en knapp för varje pokemon
	results.forEach(result => {
    const pokemonName = result.name;
    const newButton = document.createElement('button');
    newButton.innerText = pokemonName;

    // Skapa en div för sökresultatet
    const newDiv = document.createElement('div');
    newDiv.classList.add('pokemon-result');
    newDiv.dataset.name = pokemonName;
    newDiv.appendChild(newButton);
    searchResults.appendChild(newDiv);
	});
}



// Eventlistener för cancelknapp
const cancelButton = document.createElement('button');
cancelButton.innerText = 'Avbryt';
cancelButton.addEventListener('click', () => {
// Dölj inmatningsfältet och knappen
pokemonNameInput.style.display = 'none';
nameInput.value = '';
});
pokemonNameInput.appendChild(cancelButton);

// Denna del av koden skapar en "avbryt-knapp" för användaren att klicka på om de vill avbryta att lägga till en Pokemon till sitt lag. När användaren klickar på "Avbryt"-knappen kommer inmatningsfältet och knappen att döljas och värdet i inmatningsfältet kommer att rensas.

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
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = `Ingen Pokemon hittades med namn '${searchTerm}'`;
            errorMessage.style.display = 'block';
        }
    }
    searchBar.value = '';
    searchResults.innerHTML = '';
}


// Denna funktion söker efter en Pokemon baserat på användarens inmatning i sökfältet. Om sökningen matchar en Pokemon som redan finns i listan med Pokemon (pokemonData), kommer funktionen lägga till Pokemonen till användarens lag. Annars kommer funktionen att söka efter Pokemonen på API:et "https://pokeapi.co" och om Pokemonen hittas, kommer den läggas till användarens lag. Om sökningen inte resulterar i att någon Pokemon hittas, kommer ett felmeddelande att visas.

// Funktion för att skapa en Pokemon-kort
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
addButton.textContent = "Lägg till i laget";
addButton.addEventListener("click", () => {
addPokemonButton.addEventListener('click', () => {

 // Visa popup-rutan för att lägga till Pokemon i laget
const addPokemonModal = document.getElementById('add-pokemon-modal');
addPokemonModal.classList.add('show');

// Lägg till en händelselyssnare på "Spara"-knappen i popup-rutan
const savePokemonButton = document.getElementById('save-pokemon');
savePokemonButton.addEventListener('click', () => {
// Hämta värdet av textfältet
const pokemonNameInput = document.getElementById('pokemon-name');
const pokemonName = pokemonNameInput.value.trim();

 // Om ett namn har angetts, lägg till Pokemon i laget
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

  // Göm popup-rutan
	addPokemonModal.classList.remove('show');
	pokemonNameInput.value = '';
}
});

});


	cardBody.appendChild(cardTitle);
	cardBody.appendChild(addButton);
	card.appendChild(cardBody);

	return card;
	})
}