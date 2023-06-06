//Grab the squares and the icons, and set the turn to whites
let squares = document.getElementsByClassName("squares");
let icons = document.getElementsByClassName("icons");
let whitesTurn = true;


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
function handleClick() {
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

function handleDragStart() {
    let square = document.getElementById(this.id);
    let icon = square.getElementsByTagName("img")[0].src;
    square.style.backgroundColor = "grey";
    event.dataTransfer.setData('text/plain',square.id + " : " + icon)
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnd() {
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
    let data = event.dataTransfer.getData('text/plain');
    let square = document.getElementById(data.substring(0,data.indexOf(":") - 1));
    let icon = data.substring(data.indexOf(":") + 1);
    let piece = icon.substring(icon.indexOf(".svg")-2,icon.indexOf(".svg"));
    if(legalMove()){
        let target = document.getElementById(this.id);
        square.getElementsByTagName("img")[0].src = "";
        target.getElementsByTagName("img")[0].src = icon;
        if(whitesTurn){
            document.getElementById("move-indicator").innerHTML = "Black to move!"
        }
        else{
            document.getElementById("move-indicator").innerHTML = "White to move!"
        }
        whitesTurn = !whitesTurn;
    }
    
    function legalMove() {
        // Checks if the person whose turn it is is moving
        if(whitesTurn && piece.substring(1) === "b" || !whitesTurn && piece.substring(1) === "w") {
            return false;
        }

        return true;
    }
}


