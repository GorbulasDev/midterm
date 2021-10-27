// Placeholder to display the result of our search.
let searchResultElement = document.querySelector('#search-result')
// Placeholder to display the Pokeball image on the footer.
let pokeBallElement = document.querySelector('#pokeball-footer')
// Pokemon Image (front).
let pokeImageFront = document.querySelector('#poke-image-front')
// Search field for user input.
let pokeSearchElement = document.querySelector('#poke-search')
// Placeholder to display the time and date.
let timeElement = document.querySelector('#time')
// Submit button.
let submitButton = document.querySelector("#submit-answer")
// Placeholder which accepts user input.
let userAnswerElement = document.querySelector('#user-answer')
// Placeholder to display the Pokemon statistics (move/more information)
let pokemonStatisticsTable = document.querySelector('#pokemon-statistics')
// Placeholder to display the move effect when the Modal is open.
let moveDataEffectDetails = document.querySelector('#move-data-container')
// Placeholder to display the Modal title.
let moveNameModalTitle = document.querySelector('#exampleModalLabel')

let pokemonStatisticsContainer = document.querySelector('#pokemon-statistics-container')

    /* The submit button takes the user input, and if valid, makes an API call
        to the server, and if successful, returns a list of available Pokemon "moves",
        with a button that allows the user to create a second request for additional
        "move" information.
    */
    submitButton.addEventListener('click', () => {
        // Clear the search result element.
        searchResultElement.innerHTML = ''
        // Read the user input, enforcing a lower-case policy.
        let userAnswer = userAnswerElement.value.toLowerCase()

        // If we don't have any text, prevent processing.
        if (userAnswer == '') {
            searchResultElement.innerHTML = 'Please enter a valid Pokemon name!'
            return
        }

        // Process the request by using the user input as the endpoint.
        let pokemonApiUrl = `https://pokeapi.co/api/v2/pokemon/${userAnswer}`
            fetch(pokemonApiUrl)
                .then((response) => response.json())
                .then((data) => {
                    // Update the search result element to display that we've found a Pokemon.
                    searchResultElement.innerHTML = `I found information on ${data.name}!`
    
                    // Fetch the (front) image from the object.
                    pokeImageFront.src = data.sprites.front_default
                    
                    /*Iterate over each "move" in the API, and extract
                       the name and link associated with it.
                    */
                    data.moves.forEach((moveList) => {
                        console.log(moveList.move.name)
                        console.log(moveList.move.url)

                        // Create the "Move" table.
                        let movesRow = document.createElement('tr')
                        let movesTableData = document.createElement('td')
                        
                        movesTableData.innerHTML = moveList.move.name
                        movesRow.appendChild(movesTableData)
                        pokemonStatisticsTable.appendChild(movesRow)

                        // Create the "More Information" table.
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

                            /*  Create a second fetch to retrieve the second JSON data.
                                 This request takes the object's URL property as an input,
                                 from which we requested by clicking the Submit button.
                            */
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
                        )
                    })

                    // Add a timestamp for when the successful retrieval was made.
                    displayTimeStamp()

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

    // TimeStamp for when the successful retrieval was made.
    function displayTimeStamp() {
        let time = Date()
        timeElement.innerHTML = `This data was last retrieved at ${time}`
    }
