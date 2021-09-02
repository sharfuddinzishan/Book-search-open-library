const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const booksListDiv = document.getElementById('booksListDiv')
const loaderDiv = document.getElementById('loaderDiv')
const noResult = document.getElementById('noResult')


document.getElementById('searchButton').addEventListener('click', searchBooks)



function searchBooks() {
    let searchText = searchBox.value
    setLoader(1)
    setSearchSection(0)
    clearResult()
    fetch(`https://openlibrary.org/search.json?q=${searchText}`)
        .then(res => res.json())
        .then(data => {
            if (data.docs.length) {
                data.docs.forEach(book => getBooks(book))
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
    let bookName = singleBook.title_suggest ? singleBook.subtitle
        ? `${singleBook.title_suggest} -${singleBook.subtitle}` : `${singleBook.title_suggest}`
        : singleBook.subtitle
            ? `${singleBook.subtitle}` : 'Unknown Book Name'

    let authorName = singleBook.author_name != undefined
        ? `${singleBook.author_name[0]}` : 'Unknown Author'

    let publisher = singleBook.publisher != undefined
        ? `${singleBook?.publisher[0]}` : ''

    let firstPublish = singleBook.first_publish_year != undefined
        ? `${singleBook?.first_publish_year}` : ''

    let coverImageMedium = singleBook.cover_i != undefined
        ? `${singleBook.cover_i}` : ''

    showBooks(bookName, authorName, publisher, firstPublish, coverImageMedium)
}

const showBooks = (bookName, authorName, publisher, firstPublish, cover_i) => {
    let coverImageSrc = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    let colDiv = document.createElement('div')

    if (!cover_i) {
        coverImageSrc = `https://openlibrary.org/images/icons/avatar_book-sm.png`
    }
    if (!firstPublish) {
        colDiv.innerHTML = `
        <div class="card h-100 bg-light p-1 shadow-lg">
            <img src="${coverImageSrc}" class="coverImageMedium img-thumbnail card-img-top mx-auto" 
            alt="images not found" title="${bookName}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${bookName}</h5>
                    <p>by
                        <span class='ms-1 fs-5 fst-italic'>${authorName}</span>
                    </p>
                    <p>Publisher ${publisher}</p>
                </div>
        </div>
        `
    }
    else {
        colDiv.innerHTML = `
        <div class="card h-100 bg-light p-1 shadow-lg">
            <img src="${coverImageSrc}" class="coverImageMedium img-thumbnail card-img-top mx-auto" 
            alt="No Image" title="${bookName}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${bookName}</h5>
                    <p>by
                        <span class='ms-1 fs-5 fst-italic'>${authorName}</span>
                    </p>
                    <p class="text-muted">
                        <small>First published in ${firstPublish} ${publisher ? `by ${publisher}` : ``}</small>
                    </p>
                </div>
        </div>
        `
    }
    booksListDiv.appendChild(colDiv)
}

const setLoader = action => {
    action ? loaderDiv.classList.toggle('d-none') : loaderDiv.classList.toggle('d-none', true)
}
const clearResult = () => {
    searchBox.value = ''
    booksListDiv.textContent = ''
    noResult.textContent = ''
}

const setSearchSection = action => {
    action ? searchBox.toggleAttribute('readonly') : searchBox.toggleAttribute('readonly', true)
    action ? searchButton.classList.toggle('disabled') : searchButton.classList.toggle('disabled', true)
}

const setValidation = (searchProvided) => {
    noResult.innerHTML = `
    <span class="h3 text-danger fw-bold">No results found.</span>
    <a class="ms-1 h3 text-info" href="/search/inside?q=${searchProvided}">Search for books containing the phrase "${searchProvided}"?</a>
    `
}