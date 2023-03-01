//API
const pokeUrl = 'https://pokeapi.co/';

// Hämta element från DOM
const pokedexButton = document.getElementById('pokedex-button');
const myTeamButton = document.getElementById('my-team-button');
const pokedex = document.getElementById('pokedex');
const myTeam = document.getElementById('my-team');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchResultsContainer = document.getElementById('search-results');

const maxTeamSize = 3;
const startingTeam = document.querySelector('#starting-team');
const reserves = document.querySelector('#my-reserves');

function teamStatus() {
    const teamSize = startingTeam.children.length;
    if (teamSize < maxTeamSize) {
        return `The team needs ${maxTeamSize - teamSize} Pokémon`;
    } else {
        return 'Team is full';
    }
}

const statusContainer = document.createElement('div');
statusContainer.setAttribute('id', 'team-status-container');
const statusLabel = document.createElement('label');
statusLabel.setAttribute('for', 'team-status');
statusLabel.textContent = 'Team Status: ';
const statusMessage = document.createElement('span');
statusMessage.setAttribute('id', 'team-status');
statusMessage.textContent = teamStatus();
statusContainer.appendChild(statusLabel);
statusContainer.appendChild(statusMessage);
const teamContainer = document.getElementById('my-team');
teamContainer.insertBefore(statusContainer, teamContainer.firstChild);

// Lägga till eventlisteners
pokedexButton.addEventListener('click', () => {
    pokedex.style.display = 'block';
    myTeam.style.display = 'none';
});

myTeamButton.addEventListener('click', () => {
    myTeam.style.display = 'block';
    pokedex.style.display = 'none';
});

searchInput.addEventListener('keyup', function () {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length >= 3) {
        fetch(`${pokeUrl}api/v2/pokemon/?limit=1279`)
            .then(response => response.json())
            .then(data => {
                const matchingPokemon = data.results.filter(pokemon => pokemon.name.includes(searchTerm));
                let resultHtml = '';
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
                                        <button class="add-to-team" data-pokemon-id="${pokemonInfo.id}">Add to team</button>
                                        <h3 class="nickname">${pokemonInfo.name}</h3>
                                        <p>Types: ${pokemonInfo.types.join(', ')}</p>
                                    </div>
                                `;
                                searchResults.innerHTML = resultHtml;
                            });
                    });
                } else {
                    searchResults.innerHTML = '<p>No results found</p>';
                }
            });
    } else {
        searchResults.innerHTML = '';
    }
});

searchResultsContainer.addEventListener('click', event => {
    if (event.target.classList.contains('add-to-team')) {
        const card = event.target.parentElement;
        const cardClone = card.cloneNode(true);
        const removeFromTeamButton = document.createElement('button');
        const addNicknameButton = document.createElement('button');
        const addUpButton = document.createElement('button');
        const addDownbutton = document.createElement('button');
        const statusMessage = document.getElementById('team-status');

        removeFromTeamButton.textContent = 'Remove from team';
        addNicknameButton.textContent = 'Add Nickname';
        addUpButton.textContent = '↑';
        addDownbutton.textContent = '↓';

        cardClone.appendChild(removeFromTeamButton);
        cardClone.appendChild(addNicknameButton);
        cardClone.appendChild(addUpButton);
        cardClone.appendChild(addDownbutton);
        if (startingTeam.children.length < maxTeamSize) {
            startingTeam.appendChild(cardClone);
            statusMessage.textContent = teamStatus();
        } else {
            reserves.appendChild(cardClone);
        }
        cardClone.querySelector('.add-to-team').remove();
		removeFromTeamButton.addEventListener('click', (event) => {
			event.target.parentElement.remove();
		});
    }
});