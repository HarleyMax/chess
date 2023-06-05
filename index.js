//Grab the squares and the icons
let squares = document.getElementsByClassName("squares");
let icons = document.getElementsByClassName("icons");


// Initialize the chess board as an array and add eventListeners for squares
let board = new Array(8);
let currIndex = 0;
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(8);
  }
for(let i = 0 ; i < 8 ; i++) {
    for(let j = 0 ; j < 8 ; j++) {
        board[i][j] = squares[currIndex];
        board[i][j].addEventListener('click', handleClick);
        board[i][j].addEventListener('dragstart', handleDragStart);
        board[i][j].addEventListener('dragover', handleDragOver);
        board[i][j].addEventListener('dragend', handleDragEnd);
        board[i][j].addEventListener('drop', handleDrop);
        currIndex++;
    }
}

// eventListener Functions
function handleClick(event) {
    let target = document.getElementById(this.id);
    if(target.style.backgroundColor == "red"){
        if(target.getAttribute("class").includes("square1")) {
            target.style.backgroundColor = "darkgreen";
        }
        else {
            target.style.backgroundColor = "black";
        }
    }
    else{
        target.style.backgroundColor = "red";
    }
}

function handleDragStart(event) {
    let target = document.getElementById(this.id);
    target.style.backgroundColor = "grey";
}

function handleDragOver(event) {
    // Nothing necessary
}

function handleDragEnd(event) {
    let target = document.getElementById(this.id);
    if(target.getAttribute("class").includes("square1")) {
        target.style.backgroundColor = "darkgreen";
    }
    else {
        target.style.backgroundColor = "black";
    }
}

function handleDrop(event) {
    event.preventDefault();
    console.log("1");
}


