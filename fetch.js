// Placeholder to display the result of our search.
let searchResultElement = document.querySelector('#search-result')
// Placeholder to display the Pokeball image on the footer.
let pokeBallElement = document.querySelector('#pokeball-footer')
// Pokemon Image (front).
let pokeImageFront = document.querySelector('#poke-image-front')
// Pokemon Image (Back).
let pokeImageBack = document.querySelector('#poke-image-back')
// Search field for user input.
let pokeSearchElement = document.querySelector('#poke-search')
// Placeholder to display the time and date.
let timeElement = document.querySelector('#time')
// Submit button.
let submitButton = document.querySelector("#submit-answer")
// Placeholder which accepts user input.
let userAnswerElement = document.querySelector('#user-answer')

let pokemonStatisticsTable = document.querySelector('#pokemon-statistics')

let moveDataEffectDetails = document.querySelector('#move-data-container')

let moveNameModalTitle = document.querySelector('#exampleModalLabel')

let pokemonStatisticsContainer = document.querySelector('#pokemon-statistics-container')

    /* TODO: ... */
    submitButton.addEventListener('click', () => {
        // Read the user input.
        let userAnswer = userAnswerElement.value
    
        // If we don't have any text, prevent processing.
        if (userAnswer == '') {
            return
        }
    
        /* Since the API does not accept any uppercase letters,
            enfore an all lower-case rule,
            warn the user, and prevent further processing.
        */
        
        
    
        // Process the request by using the user input as the endpoint.
        let pokemonApiUrl = `https://pokeapi.co/api/v2/pokemon/${userAnswer}`
            fetch(pokemonApiUrl)
                .then((response) => response.json())
                .then((data) => {
                    // Log the object for testing.
                    console.log(data)
    
                    searchResultElement.innerHTML = `I found information on ${data.name}!`
    
                    // Extract image data from the object.

                    pokeImageFront.src = data.sprites.front_default
                    pokeImageBack.src = data.sprites.back_default
                    
                    data.moves.forEach((moveList) => {
                        console.log(moveList.move.name)
                        console.log(moveList.move.url)

                        // Moves table data.
                        let movesRow = document.createElement('tr')
                        let movesTableData = document.createElement('td')
                        
                        movesTableData.innerHTML = moveList.move.name
                        movesRow.appendChild(movesTableData)
                        pokemonStatisticsTable.appendChild(movesRow)

                        // More Information data. 
                        let moreInfoRow = document.createElement('tr')

                        pokemonStatisticsTable.appendChild(moreInfoRow)

                        let moreInfoButton = document.createElement('button')
                        moreInfoButton.innerHTML = "Click for more Info!"
                        pokemonStatisticsTable.appendChild(moreInfoButton)
                        moreInfoButton.src = moveList.move.url
                        movesRow.appendChild(moreInfoButton)

                        pokemonStatisticsContainer.style.display = 'block'
                        
                        /* When the user successfully retrieves a Pokemon, 
                            add a button for them to click and obtain 
                            additional information about the Pokemon's
                            ability. This is done by creating a second fetch
                            call to another API (the URL from the other fetch). */
                        moreInfoButton.addEventListener('click', () => {
                            // Open the modal menu.
                            $('#moreInformationModal').modal()

                            /* Let the user know we are obtaining the requested data,
                                if we aren't able to fetch quick enough.
                            */
                            moveNameModalTitle.innerHTML = 'Obtaining data...'
                            moveDataEffectDetails.innerHTML = "Obtaining data..."

                            fetchAdditionalInfo()

                            function fetchAdditionalInfo() {
                                fetch(moveList.move.url).then((responseTo) => responseTo.json())
                                .then((dataTo) => {
                                    moveNameModalTitle.innerHTML = `More information on ${moveList.move.name}`
                                    /* If the object contains a null value within the Power property,
                                        let the user know that no Power value is available. */
                                    if (!dataTo.power) {
                                        moveDataEffectDetails.innerHTML = `<b>Description:</b>&nbsp;
                                        ${dataTo.effect_entries[0].effect} <b>Power: This move has no power value.</b>`   
                                    } else {
                                        moveDataEffectDetails.innerHTML = `<b>Description:</b>&nbsp;
                                        ${dataTo.effect_entries[0].effect} <b>Power:</b> ${dataTo.power}`   
                                    }
                                })
                            }
                        })
                    })

                    // Add a timestamp for when the successful retrieval was made.
                    let time = Date()
                    timeElement.innerHTML = `This data was last retrieved at ${time}`

                    // Display the Pokeball footer.
                    pokeBallElement.style.display = "block"

                // If we run into an error white fetching the API, alert the user
                //  and prevent further processing.
                }).catch((err) => {
                    alert('ERROR! We either failed to find the pokemon, or an unexpected error occured.', err)
                    return
                })
        }
    )
