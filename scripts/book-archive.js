// Getting Common Elements Location
const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const booksListDiv = document.getElementById('booksListDiv')
const loaderDiv = document.getElementById('loaderDiv')
const noResultDiv = document.getElementById('noResultDiv')
const totalSearchDiv = document.getElementById('totalSearchDiv')

// Event Triggered Wher Search Button Clicked 
document.getElementById('searchButton').addEventListener('click', searchBooks)

function searchBooks() {
    let getSearchText = searchBox.value
    let searchText = getSearchText.toLowerCase()
    const url = `https://openlibrary.org/search.json?q=${searchText}`
    // Clear All Previuos Result 
    clearResult()
    // searchbox and serchButton disabled 
    disableSearchSection(0)
    // Enable Spinner Loading 
    disabledLoader(1)

    fetch(url)
        .then(handleErrors) // Checked response id OK?
        .then(data => {
            // Get numFound Property value from api
            let countBooksFromResponse = data.numFound
            // Get Total Length of Retrived Array 
            let totalBooks = data.docs.length
            if (countBooksFromResponse) {
                // Retrieved single Object from Array and passed as parameter
                data.docs?.forEach(book => getBooks(book))
                // get Total Number of Books found in searching when all data are displayed successfully
                getTotalSearch(totalBooks, countBooksFromResponse)
            }
            else {
                // Handle Error, if number of books zero
                setNoDataValidation(data.q)
            }
        })
        .catch(error => serverValidation(error)) // if handleErrors method throw an error
        .finally(() => {
            // Disable Spinner When Searching Result Retrived 
            disabledLoader(0)
            // Enable Serchbox and searchButton, When Searching Result Retrived 
            disableSearchSection(1)
        })
}
/**********************Method To Get Each Book Information********************************* */
const getBooks = singleBook => {
    // Destructuring 
    let { title_suggest, subtitle, author_name, publisher, first_publish_year, cover_i: cover_image } = singleBook
    // Get Book Name using Ternary Operator
    // If title_suggest found then checked if subtitle attribute exists or not
    let bookName = title_suggest ? subtitle
        ? `${title_suggest} -${subtitle}` : `${title_suggest}`
        : subtitle
            ? `${subtitle}` : 'Unknown Book Name'

    let authorName = author_name != undefined
        ? `${author_name[0]}` : 'Unknown Author'

    let publisherName = publisher != undefined
        ? `${publisher[0]}` : ''

    let firstPublish = first_publish_year != undefined
        ? `${first_publish_year}` : ''

    let coverImageMedium = cover_image != undefined
        ? `${cover_image}` : ''
    // Passed Specific Property Value as Parameter to show in Browser 
    showBooks(bookName, authorName, publisherName, firstPublish, coverImageMedium)
}
/**********************Method To Displayed Books using Template Literals************************** */
const showBooks = (bookName, authorName, publisher, firstPublish, cover_i) => {
    let coverImageSrc = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    // Handle if Image source not found 
    if (!cover_i) {
        coverImageSrc = `https://openlibrary.org/images/icons/avatar_book-sm.png`
    }
    // Create Element Div
    let colDiv = document.createElement('div')

    colDiv.innerHTML =
        `
        <div class="card h-100 bg-light p-1 shadow-lg">
            <img src="${coverImageSrc}" class="coverImageMedium img-thumbnail card-img-top mx-auto" 
            alt="No Image" title="${bookName}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${bookName}</h5>
                    <p>by
                        <span class='ms-1 fs-5 fst-italic'>${authorName}</span>
                    </p>
                    <p>
                        <small class="text-muted"> 
            ${
        //If firstPublish exist then checked Publisher exists or not 
        firstPublish
            ? publisher
                ? `First published in ${firstPublish} by ${publisher} ` : `First published in ${firstPublish}`
            : publisher
                ? `Publisher: ${publisher}` : ``}
                        </small>
                    </p>
                </div>
        </div>
       `
    // Append InerHTML of Created div to parent div
    booksListDiv.appendChild(colDiv)
}
/*********************Get Total Serach Found******************* */
const getTotalSearch = (totatDisplayBooks, actualBooks) => {
    if (totatDisplayBooks === actualBooks) {
        totalSearchDiv.innerHTML = `
        <small class="text-muted text-sm-center fw-bold">
        Showing total <span>${totatDisplayBooks}</span> books 
        </small>`
    }
    else {
        totalSearchDiv.innerHTML = `
        <small class="text-muted text-sm-center fw-bold">
        Showing <span>${totatDisplayBooks}</span> of <span>${actualBooks}</span> books
        </small>`
    }
}

/**********************************
 * CLEAR SEARCHBOX, TEXT CONTENT OF DIV, SEARCH FOUND TEXT
 * DISABLE ENABLE LOADER
 * T******************************** */
const disabledLoader = action => {
    action ? loaderDiv.classList.toggle('d-none') : loaderDiv.classList.toggle('d-none', true)
}

const clearResult = () => {
    searchBox.value = ''
    booksListDiv.textContent = ''
    noResultDiv.textContent = ''
    totalSearchDiv.textContent = ''
}

const disableSearchSection = action => {
    action ? searchBox.toggleAttribute('readonly') : searchBox.toggleAttribute('readonly', true)
    action ? searchButton.classList.toggle('disabled') : searchButton.classList.toggle('disabled', true)
}

/********************ERROR HANDLING**************************************** */
// Handle Server Error, if response not retrived
let handleErrors = response => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
}
// Displayed Server Error
const serverValidation = (errorText) => {
    noResultDiv.innerHTML = `<span class="h3 text-warning fw-bold">${errorText}</span>`
}
// Displayed message if No Data Found 
const setNoDataValidation = searchText => {
    noResultDiv.innerHTML = `
    <span class="h3 text-danger fw-bold">No results found.</span>
    <a class="ms-1 h3 text-info" href="/search/inside?q=${searchText}">Search for books containing the phrase "${searchText}"?</a>
    `
}
