// URL:en för API:t
const pokeUrl = "https://pokeapi.co/api/v2/";

//DOM Element
//Knappar och containers
const pokedexButton = document.getElementById("pokedex-button");
const myTeamButton = document.getElementById("my-team-button");
const pokedex = document.getElementById("pokedex");
const myTeam = document.getElementById("my-team");

//inputfält och sökcontainer
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchResultsContainer = document.getElementById("search-results");

//Konstanter för Laget
const maxTeamSize = 3;
const startingTeam = document.querySelector("#starting-team");
const reserves = document.querySelector("#my-reserves");

//Berättar om det finns plats i laget eller om det är fullt
function teamStatus() {
    const teamSize = startingTeam.children.length;
    if (teamSize < maxTeamSize) {
        return `The team needs ${maxTeamSize - teamSize} more Pokémons`;
    } else {
        return "Team is full";
    }
}

//Lägger till en element osv för statusmeddelandet från ovanför
const statusContainer = document.createElement("div");
statusContainer.setAttribute("id", "team-status-container");
const statusLabel = document.createElement("label");
statusLabel.setAttribute("for", "team-status");
statusLabel.textContent = "Team Status: ";
const statusMessage = document.createElement("span");
statusMessage.setAttribute("id", "team-status");
statusMessage.textContent = teamStatus();
statusContainer.appendChild(statusLabel);
statusContainer.appendChild(statusMessage);
const teamContainer = document.getElementById("my-team");
teamContainer.insertBefore(statusContainer, teamContainer.firstChild);

//Eventlyssnare för att visa/dölja pokedex/my team
pokedexButton.addEventListener("click", () => {
    pokedex.style.display = "block";
    myTeam.style.display = "none";
});

myTeamButton.addEventListener("click", () => {
    myTeam.style.display = "block";
    pokedex.style.display = "none";
});
//eventlistener för sökrutan
searchInput.addEventListener("keyup", async function () {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length >= 3) {
        try {
            //fetchar pokemons från API:et utifrån sökningen
            const response = await fetch(`${pokeUrl}pokemon/?limit=1279`);
            const data = await response.json();
            const matchingPokemon = data.results.filter((pokemon) =>
                pokemon.name.includes(searchTerm)
            );
            let resultHtml = "";
            //om man får matchningar så visas de i sökresultaten
            if (matchingPokemon.length > 0) {
                for (const pokemon of matchingPokemon) {
                    // lägger in bilder och info i ett kort
                    const response = await fetch(pokemon.url);
                    const data = await response.json();
                    const pokemonInfo = {
                        name: data.name,
                        image: data.sprites.front_default,
                        types: data.types.map((type) => type.type.name),
                        abilities: data.abilities.map(
                            (ability) => ability.ability.name
                        ),
                    };
                    resultHtml += `
            <div class=card>
				<img src="${pokemonInfo.image}" alt="${pokemonInfo.name}">
				<button class="add-to-team">Add to team</button>
				<h2 class="name">${pokemonInfo.name}</h2>
				<p class="types">Types: ${pokemonInfo.types.join(", ")}</p>
				<p class="abilities">Abilities: ${pokemonInfo.abilities.join(", ")}</p>
            </div>
			`;

                    searchResults.innerHTML = resultHtml;
                }
            } else {
                searchResults.innerHTML = "<p>No results found</p>";
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        searchResults.innerHTML = "";
    }
});

//Lägger till pokemon till laget nör man klickar på add to team knappen
searchResultsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-team")) {
        //skapar en klon av kortet och lägger till knappar och inputfält till kortet
        const card = event.target.parentElement;
        const cardClone = card.cloneNode(true);
        const removeFromTeamButton = document.createElement("button");
        const addNicknameButton = document.createElement("button");
        const addNicknameInput = document.createElement("input");
        const addUpButton = document.createElement("button");
        const addDownButton = document.createElement("button");
        const nickname = document.createElement("p");
        const statusMessage = document.getElementById("team-status");
        const overlay = document.getElementById("overlay");
        const overlayMessage = document.createElement("div");

        //Ger id och innehåll för knappar, inputfält, overlay osv
        addNicknameInput.setAttribute("id", "nickname");
        overlayMessage.setAttribute("id", "overlay-message");
        removeFromTeamButton.textContent = "Remove from team";
        addNicknameInput.value = "";
        addNicknameButton.textContent = "Add Nickname";
        addUpButton.textContent = "↑";
        addDownButton.textContent = "↓";
        overlayMessage.textContent = "Adding to team...";

        //Appenda knappar och inputfält till det klonade kortet samt overlayen som berättar att man lagt till i laget
        cardClone.appendChild(removeFromTeamButton);
        cardClone.appendChild(addNicknameInput);
        cardClone.appendChild(addNicknameButton);
        cardClone.appendChild(addUpButton);
        cardClone.appendChild(addDownButton);
        overlay.appendChild(overlayMessage);

        // lägger till cssklasser till elementen
        overlay.classList.add("show");
        removeFromTeamButton.classList.add("remove-from-team");
        addNicknameInput.classList.add("add-nickname-input");
        addNicknameButton.classList.add("add-nickname-button");
        addUpButton.classList.add("add-up-button");
        addDownButton.classList.add("add-down-button");
        overlayMessage.classList.add("overlay-message");
        nickname.classList.add("nickname");

        //bestämmer hur länge overlayen visas
        setTimeout(() => {
            overlay.classList.remove("show");
            overlay.removeChild(overlayMessage);
        }, 700);

        const nameElement = cardClone.querySelector(".name");
        nickname.textContent = "Nickname: ";
        nameElement.parentNode.insertBefore(nickname, nameElement);

        //Lägger till i starting team så länge det inte är fullt. när det är fullt börjar reserves fyllas på istället.
        if (startingTeam.children.length < maxTeamSize) {
            startingTeam.appendChild(cardClone);
            statusMessage.textContent = teamStatus();
        } else {
            reserves.appendChild(cardClone);
        }
        //Tar bort add to team knappen
        cardClone.querySelector(".add-to-team").remove();
        removeFromTeamButton.addEventListener("click", (event) => {
            event.target.parentElement.remove();
            statusMessage.textContent = teamStatus();
        });

        //eventlyssnare för att lögga till smeknamn klicka på knappen och trycka på enter
        addNicknameButton.addEventListener("click", (event) => {
            addNickname();
        });

        addNicknameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                addNickname();
            }
        });

        //lägger till smeknamnet
        function addNickname() {
            const nicknameValue = addNicknameInput.value;
            const nicknameElement =
                addNicknameButton.parentElement.querySelector("p");
            if (nicknameValue !== "") {
                nicknameElement.textContent = `Nickname: ${nicknameValue}`;
            }
            addNicknameInput.value = "";
        }

        //eventlyssnare för upp ned inom laget
        addUpButton.addEventListener("click", (event) => {
            const card = event.target.parentElement;
            const previousSibling = card.previousElementSibling;
            if (previousSibling) {
                card.parentElement.insertBefore(card, previousSibling);
            }
        });
        addDownButton.addEventListener("click", (event) => {
            const card = event.target.parentElement;
            const nextSibling = card.nextElementSibling;
            if (nextSibling) {
                card.parentElement.insertBefore(nextSibling, card);
            }
        });
    }
});
