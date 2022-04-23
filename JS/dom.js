const COMPLETED_LIST_BOOK_ID = "read";
const UNCOMPLETED_LIST_BOOK_ID = "unread";
const BOOK_ITEMID = "itemId";


function makeBook(dataBuku, datapenulis, year, isCompleted) {
    const image = document.createElement('img');
    if (isCompleted) {
        image.setAttribute('src', 'aset/read.jpg')
    } else {
        image.setAttribute('src', 'aset/unread.jpg')
    }

    const imageBook = document.createElement('div');
    imageBook.classList.add('image-book')
    imageBook.append(image)

    const judulBuku = document.createElement("h2");
    judulBuku.innerText = dataBuku;

    const penulis = document.createElement("p");
    penulis.innerText = datapenulis;

    const dataWaktu = document.createElement("small");
    dataWaktu.innerText = `${year}`;

    const textContainer = document.createElement("div");
    textContainer.classList.add("detail-book")
    textContainer.append(judulBuku, penulis, dataWaktu);

    const container = document.createElement("div");
    container.classList.add("containerBook")
    container.append(imageBook, textContainer);

    if (isCompleted) {
        container.append(
            createTrashButton(),
            createUndoButton()
        );
    } else {
        container.append(createUnreadButton());
    }

    return container;
}

function createTrashButton() {
    return createButton("trash-book", function (event) {
        removeBookFromCompleted(event.target.parentElement);
    });
}

function createUndoButton() {
    return createButton("unread-button", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createUnreadButton() {
    return createButton("read-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

const booksLength = () => {
    const jumlahBuku = document.getElementById('totalBuku');
    jumlahBuku.innerText = books.length;
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

    const judulBuku = document.getElementById("inputBookTitle").value;
    const penulis = document.getElementById("inputBookAuthor").value;
    const tanggal = document.getElementById("inputBookYear").value;

    const book = makeBook(judulBuku, penulis, tanggal, false);

    const bookObject = composeBookObject(judulBuku, penulis, tanggal, false);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    uncompletedBOOKList.append(book);
    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const judulBuku = bookElement.querySelector(".detail-book > h2").innerText;
    const penulis = bookElement.querySelector(".detail-book > p").innerText;
    const dataWaktu = bookElement.querySelector(".detail-book > small").innerText;

    const newBook = makeBook(judulBuku, penulis, dataWaktu, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    bookCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    if (confirm("Apakah anda yakin mau menghapus buku ini?")) {

        bookElement.remove();
        updateDataToStorage();
    }
}

function undoBookFromCompleted(bookElement) {
    const unbookCompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const judulBuku = bookElement.querySelector(".detail-book > h2").innerText;
    const penulis = bookElement.querySelector(".detail-book > p").innerText;
    const dataWaktu = bookElement.querySelector(".detail-book > small").innerText;

    const newBook = makeBook(judulBuku, penulis, dataWaktu, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    unbookCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}