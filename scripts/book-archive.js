const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const booksListDiv = document.getElementById('booksListDiv')
const loaderDiv = document.getElementById('loaderDiv')
const noResultDiv = document.getElementById('noResultDiv')
const totalSearchDiv = document.getElementById('totalSearchDiv')

document.getElementById('searchButton').addEventListener('click', searchBooks)

function searchBooks() {
    let searchText = searchBox.value
    clearResult()
    setSearchSection(0)
    setLoader(1)
    fetch(`https://openlibrary.org/search.json?q=${searchText}`)
        .then(res => res.json())
        .then(data => {
            let searchResultCount = data.docs.length
            if (searchResultCount) {
                data.docs.forEach(book => getBooks(book))
                getTotalSearch(searchResultCount)
            }
            else {
                setValidation(searchText)
            }
        })
        .finally(() => {
            setLoader(0)
            setSearchSection(1)
        })
}

const getBooks = singleBook => {
    let { title_suggest, subtitle, author_name, publisher, first_publish_year, cover_i: cover_image } = singleBook
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

    showBooks(bookName, authorName, publisherName, firstPublish, coverImageMedium)
}

const showBooks = (bookName, authorName, publisher, firstPublish, cover_i) => {
    let coverImageSrc = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    if (!cover_i) {
        coverImageSrc = `https://openlibrary.org/images/icons/avatar_book-sm.png`
    }
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
            ${firstPublish
            ? publisher
                ? `First published in ${firstPublish} by ${publisher} ` : `First published in ${firstPublish}`
            : publisher
                ? `Publisher: ${publisher}` : ``}
                        </small>
                    </p>
                </div>
        </div>
       `
    booksListDiv.appendChild(colDiv)
}

const setLoader = action => {
    action ? loaderDiv.classList.toggle('d-none') : loaderDiv.classList.toggle('d-none', true)
}

const clearResult = () => {
    searchBox.value = ''
    booksListDiv.textContent = ''
    noResultDiv.textContent = ''
    totalSearchDiv.textContent = ''
}

const setSearchSection = action => {
    action ? searchBox.toggleAttribute('readonly') : searchBox.toggleAttribute('readonly', true)
    action ? searchButton.classList.toggle('disabled') : searchButton.classList.toggle('disabled', true)
}

const setValidation = searchText => {
    noResultDiv.innerHTML = `
    <span class="h3 text-danger fw-bold">No results found.</span>
    <a class="ms-1 h3 text-info" href="/search/inside?q=${searchText}">Search for books containing the phrase "${searchText}"?</a>
    `
}

const getTotalSearch = (totatBooks) => {
    totalSearchDiv.innerHTML = `<h3 class="text-info fw-bolder">Total Books Found <span class="fw-bold fs-2">${totatBooks}</span></h3>`
}