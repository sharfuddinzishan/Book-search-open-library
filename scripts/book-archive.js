const searchBox = document.getElementById('searchBox')
const booksListDiv = document.getElementById('booksListDiv')

document.getElementById('searchButton').addEventListener('click', searchBooks)



function searchBooks() {
    searchText = searchBox.value

    fetch(`http://openlibrary.org/search.json?q=${searchText}`)
        .then(res => res.json())
        .then(data => getBooks(data.docs))
}

const getBooks = booksArray => {
    console.log(booksArray.length)
    for (let book of booksArray) {
        let bookName = book.title_suggest ? book.subtitle
            ? `${book.title_suggest} -${book.subtitle}` : `${book.title_suggest}`
            : book.subtitle
                ? `${book.subtitle}` : 'Unknown Name'

        let authorName = book.author_name != undefined
            ? `${book.author_name[0]}` : 'Unknown Author'

        let publisher = book.publisher != undefined
            ? `${book?.publisher[0]}` : 'Unknown Publisher'

        let firstPublish = book.first_publish_year != undefined
            ? `${book?.first_publish_year}` : 'N/A'

        let coverImageMed = book.cover_i != undefined
            ? `${book.cover_i}` : ''

        showBooks(bookName, authorName, publisher, firstPublish, coverImageMed)
        // console.log(`Book Name: ${bookName}, Author Name: ${authorName}, Publisher: ${publisher}, Published: ${firstPublish} `)
    }
}

const showBooks = (bookName, authorName, publisher, firstPublish, cover_i) => {
    let colDiv = document.createElement('div')
    let coverImageSrc = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    if (!cover_i) {
        coverImageSrc = `https://openlibrary.org/images/icons/avatar_book-sm.png`
    }
    colDiv.innerHTML = `
    <div class="card h-100">
        <img src="${coverImageSrc}" class="coverImageMedium img-thumbnail card-img-top" 
        alt="images not found" title="${bookName}">
            <div class="card-body">
                <h5 class="card-title">${bookName}</h5>
                <p>${authorName}</p>
                <p>${publisher}</p>
                <p>${firstPublish}</p>
            </div>
    </div>
    `
    booksListDiv.appendChild(colDiv)
}

