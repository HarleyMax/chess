//Grab the squares and the icons, and set the turn to whites
let squaresRows = [...document.getElementsByTagName("tr")].reverse();
let squares = []
for(let i = 0 ; i < 8 ; i++) {
    let row = [...squaresRows[i].getElementsByTagName("th")];
    squares = squares.concat(row);
}
let icons = document.getElementsByClassName("icons");
let whitesTurn = true;

// This will keep track if an en pessant square is open to move to
let enPessant = "";
let movesSinceEnPessantOpened = 0;

// Initialize the chess board as an array and add eventListeners for squares
let board = new Array(8);
let currIndex = 0;
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(8);
  }
for(let i = 0 ; i < 8 ; i++) {
    for(let j = 0 ; j < 8 ; j++) {
        board[j][i] = squares[currIndex];
        board[j][i].addEventListener('click', handleClick);
        board[j][i].addEventListener('dragstart', handleDragStart);
        board[j][i].addEventListener('dragover', handleDragOver);
        board[j][i].addEventListener('dragend', handleDragEnd);
        board[j][i].addEventListener('drop', handleDrop);
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
    let target = document.getElementById(this.id);
    if(legalMove()){
        square.getElementsByTagName("img")[0].src = "/piece-icons/empty.svg";
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
        let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
        let targetPiece = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
        // Checks if the person whose turn it is is moving
        if(whitesTurn && piece.substring(1) === "b" || !whitesTurn && piece.substring(1) === "w" || icon.includes("empty")) {
            return false;
        }

        // Gets the original position and ending position of the moving piece
        let positionXOriginal = square.id.substring(0).charCodeAt(0)-97;
        let positionYOriginal = square.id.substring(1) - 1;

        let positionXEnding = target.id.substring(0).charCodeAt(0)-97;
        let positionYEnding = target.id.substring(1) - 1;

        // Checks if the move is legal based on what piece is being moved
        if(piece === "pw") {
            if(enPessant === target.id && movesSinceEnPessantOpened === 1) {
                enPessant = "";
                movesSinceEnPessantOpened = 0;
                let column = target.id[0];
                let row = target.id[1] - 1;
                let iconToBeRemoved = String.fromCharCode(column.charCodeAt(0)) + row.toString();
                document.getElementById(iconToBeRemoved).getElementsByTagName("img")[0].src = "/piece-icons/empty.svg";
                return true;
            }
            let squareOneAbove = document.getElementById(board[positionXOriginal][positionYOriginal+1].id)
            let temp2 = document.getElementById(board[positionXOriginal][positionYOriginal+1].id).getElementsByTagName("img")[0].src;
            let pieceOneAbove = temp2.substring(temp2.indexOf(".svg")-2,temp2.indexOf(".svg"));
            if(targetPiece === "ty") {
                if(positionYOriginal === 1){
                    if(positionYEnding - positionYOriginal != 1 && positionYEnding - positionYOriginal != 2) {
                        return false;
                    }
                    if(pieceOneAbove !== "ty") {
                        return false;
                    }
                    enPessant = squareOneAbove.id;
                    if(positionYEnding - positionYOriginal === 2) {
                        movesSinceEnPessantOpened = 0;
                    }
                }
                else{
                    if(positionYEnding - positionYOriginal != 1) {
                        return false;
                    }
                }
                if(positionXOriginal != positionXEnding) {
                    return false
                }
            }
            else{
                if(positionYEnding - positionYOriginal != 1 || (positionXEnding - positionXOriginal != 1 && (positionXEnding - positionXOriginal != -1))) {
                    return false
                }
            }
        }
        else if(piece === "pb") {
            if(enPessant === target.id && movesSinceEnPessantOpened === 1) {
                enPessant = "";
                movesSinceEnPessantOpened = 0;
                let column = target.id[0];
                let row = parseInt(target.id[1]) + 1;
                let iconToBeRemoved = String.fromCharCode(column.charCodeAt(0)) + row.toString();
                document.getElementById(iconToBeRemoved).getElementsByTagName("img")[0].src = "/piece-icons/empty.svg";
                return true;
            }
            let squareOneBelow = document.getElementById(board[positionXOriginal][positionYOriginal-1].id)
            let temp2 = document.getElementById(board[positionXOriginal][positionYOriginal-1].id).getElementsByTagName("img")[0].src;
            let pieceOneBelow = temp2.substring(temp2.indexOf(".svg")-2,temp2.indexOf(".svg"));
            if(targetPiece === "ty") {
                if(positionYOriginal === 6){
                    if(positionYEnding - positionYOriginal != -1 && positionYEnding - positionYOriginal != -2) {
                        return false;
                    }
                    if(pieceOneBelow !== "ty") {
                        return false;
                    }
                    enPessant = squareOneBelow.id;
                    if(positionYEnding - positionYOriginal === -2) {
                        movesSinceEnPessantOpened = 0;
                    }
                }
                else{
                    if(positionYEnding - positionYOriginal != -1) {
                        return false;
                    }
                }
                if(positionXOriginal != positionXEnding) {
                    return false
                }
            }
            else{
                if(positionYEnding - positionYOriginal != -1 || (positionXEnding - positionXOriginal != 1 && (positionXEnding - positionXOriginal != -1))) {
                    return false
                }
            }
        }

        else if(piece === "nw") {
            let corrOrientation1 = positionYEnding - positionYOriginal == 2 && positionXEnding - positionXOriginal == 1;
            let corrOrientation2 = positionYEnding - positionYOriginal == 1 && positionXEnding - positionXOriginal == 2;
            let corrOrientation3 = positionYEnding - positionYOriginal == -1 && positionXEnding - positionXOriginal == 2;
            let corrOrientation4 = positionYEnding - positionYOriginal == -2 && positionXEnding - positionXOriginal == 1;
            let corrOrientation5 = positionYEnding - positionYOriginal == -2 && positionXEnding - positionXOriginal == -1;
            let corrOrientation6 = positionYEnding - positionYOriginal == -1 && positionXEnding - positionXOriginal == -2;
            let corrOrientation7 = positionYEnding - positionYOriginal == 1 && positionXEnding - positionXOriginal == -2;
            let corrOrientation8 = positionYEnding - positionYOriginal == 2 && positionXEnding - positionXOriginal == -1;
            let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
            let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
            let ownPiece = colorOfLandingPiece === "w";
            if(!(corrOrientation1 | corrOrientation2 | corrOrientation3 | corrOrientation4 | corrOrientation5 | corrOrientation6 | corrOrientation7 | corrOrientation8) | ownPiece) return false;
        }

        else if(piece === "nb") {
            let corrOrientation1 = positionYEnding - positionYOriginal == 2 && positionXEnding - positionXOriginal == 1;
            let corrOrientation2 = positionYEnding - positionYOriginal == 1 && positionXEnding - positionXOriginal == 2;
            let corrOrientation3 = positionYEnding - positionYOriginal == -1 && positionXEnding - positionXOriginal == 2;
            let corrOrientation4 = positionYEnding - positionYOriginal == -2 && positionXEnding - positionXOriginal == 1;
            let corrOrientation5 = positionYEnding - positionYOriginal == -2 && positionXEnding - positionXOriginal == -1;
            let corrOrientation6 = positionYEnding - positionYOriginal == -1 && positionXEnding - positionXOriginal == -2;
            let corrOrientation7 = positionYEnding - positionYOriginal == 1 && positionXEnding - positionXOriginal == -2;
            let corrOrientation8 = positionYEnding - positionYOriginal == 2 && positionXEnding - positionXOriginal == -1;
            let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
            let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
            let ownPiece = colorOfLandingPiece === "b";
            if(!(corrOrientation1 | corrOrientation2 | corrOrientation3 | corrOrientation4 | corrOrientation5 | corrOrientation6 | corrOrientation7 | corrOrientation8) | ownPiece) return false;
        }

        else if(piece === "bw") {
                
        }

        else if(piece === "bb") {
                
        }

        else if(piece === "kw") {

        }

        else if(piece === "kb") {

        }

        else if(piece === "qw") {

        }
        
        else if(piece === "qb") {

        }

    
        else if(piece === "rw") {

        }

        else {

        }
        movesSinceEnPessantOpened++;
        return true;
        }
}


