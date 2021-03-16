// local storage code from mozilla
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

// my code
let myLibrary = [];

function loadExampleLibrary() {
    alert("Warning: The example library will not override your local library unless you save it.");
    myLibrary = [
        {title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", pageCount:464, completed:true, rating:10},
        {title: "The C++ Programming Language", author: "Bjarne Stroustrup", pageCount:1376, completed:true, rating:9},
        {title: "Steve Jobs: A Biography", author: "Walter Isaacson", pageCount:656, completed:true, rating:9},
        {title: "The Man Who Loved Only Numbers: The Story of Paul Erdos and the Search for Mathematical Truth", author: "Paul Hoffman", pageCount:336, completed:true, rating:10}
    ];
    refreshLibrary();
}

function saveLibrary() {
    if(storageAvailable('localStorage')) {
        let storage = window['localStorage'];
        storage.setItem("libraryLength", myLibrary.length);
        let spaceSeperatedData = "";
        for(let i = 0; i < myLibrary.length;i++) {
            spaceSeperatedData = "";
            for (mem in myLibrary[i]) {
                spaceSeperatedData += myLibrary[i][mem] + "~";
            }
            storage.setItem(i, spaceSeperatedData);
        }
    }
    else {
        console.log("No local storage.");
    }
}

function loadLibrary() {
    if(storageAvailable('localStorage') == false) {
        return;
    }

    myLibrary = [];
    let storage = window['localStorage'];
    let items = storage.getItem("libraryLength");
    if(+items == 0) {
        return;
    }
    for(let i = 0; i < +items; i++) {
        parseStringIntoBook(storage.getItem(""+i))
    }
    
    refreshLibrary();
}

function clearLibrary() {
    if(!storageAvailable('localStorage')) {
        return;
    }

    let storage = window['localStorage'];
    myLibrary = [];
    storage.clear();
    console.log("library erased");
    refreshLibrary();
}

function parseStringIntoBook() {
    let str = arguments[0];
    let data = str.split("~");
    let book = Book(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4]
    );
    myLibrary.push(book);
}

function Book() {
    return {
        title: arguments[0],
        author: arguments[1],
        pageCount: arguments[2],
        completed: arguments[3],
        rating: arguments[4],
        
    }
}

function addBookToLibrary() {
    myLibrary.push(arguments[0]);
    saveLibrary();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createBookHeaders() {
    let bookSection = document.querySelector(".books");
    let row = document.createElement("tr");
    let headers = ["Title", "Author", "Page Count", "Completed", "Rating", "Edit"];
    let node = document.createElement("th");
    for(i in headers) {
        node = node.cloneNode(true);
        node.textContent = headers[i];
        row.appendChild(node);
    }
    bookSection.appendChild(row);
}

function eraseBook(position) {
    myLibrary.splice(position, 1);
    saveLibrary();
    refreshLibrary();
}

function refreshLibrary() {
    let bookSection = document.querySelector(".books");
    removeAllChildNodes(bookSection);
    createBookHeaders();
    let bookRow = document.createElement("tr");
    let bookElement = document.createElement("td");
    let deleteButton = document.createElement("button");
    for(book in myLibrary) {
        // reset row
        deleteButton = deleteButton.cloneNode(true);
        bookRow = bookRow.cloneNode(true);
        removeAllChildNodes(bookRow);
        // reset element data
        for (property in myLibrary[book]) {
            bookElement = bookElement.cloneNode(true);
            bookElement.textContent = myLibrary[book][property];
            bookRow.appendChild(bookElement);
        }

        // add delete button
        bookElement = bookElement.cloneNode(true);  
        bookElement.textContent = "";  
        // can store values within a button via value or some other parameter
        deleteButton.value = +book;
        deleteButton.addEventListener('click', function(e){
            eraseBook(this.value);
        });
        deleteButton.textContent = "remove";
        bookElement.appendChild(deleteButton);
        bookRow.appendChild(bookElement);
        bookSection.appendChild(bookRow);
    }
}
function openBookForm() {
    let bookForm = document.querySelector("#book-form");
    bookForm.classList.toggle("unfocus-main");

    let form = document.querySelector("form");
    form.classList.toggle("offscreen");
}

function submitBook() {
    console.log("Got here");
    let bookForm = document.querySelector("#book-form");
    bookForm.classList.toggle("unfocus-main");
    let form = document.querySelector("form");
    form.classList.toggle("offscreen");

    let newBook = Book (
        document.querySelector("#title").value,
        document.querySelector("#author").value,
        document.querySelector("#page-count").value,
        document.getElementById("completed").checked,
        document.getElementById("rating").value
    )
    addBookToLibrary(newBook);
}

loadLibrary();
refreshLibrary();