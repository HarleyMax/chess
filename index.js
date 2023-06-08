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
        square.getElementsByTagName("img")[0].src = "piece-icons/empty.svg";
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
                document.getElementById(iconToBeRemoved).getElementsByTagName("img")[0].src = "piece-icons/empty.svg";
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
                document.getElementById(iconToBeRemoved).getElementsByTagName("img")[0].src = "piece-icons/empty.svg";
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
            let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
            let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
            if(positionXEnding - positionYEnding != positionXOriginal - positionYOriginal && positionXOriginal + positionYOriginal != positionXEnding + positionYEnding) {
                return false;
            }
            if(endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal + 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            else if(endingXPositionMoreThanOriginalXPosition && !endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            else if(!endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal + 1  ; positionYOriginal < positionYEnding ; positionXOriginal--,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            else{
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal > positionXEnding ; positionXOriginal--,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
        }

        else if(piece === "bb") {
            let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
            let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
            if(positionXEnding - positionYEnding != positionXOriginal - positionYOriginal && positionXOriginal + positionYOriginal != positionXEnding + positionYEnding) {
                return false;
            }
            if(endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal + 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            else if(endingXPositionMoreThanOriginalXPosition && !endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            else if(!endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal + 1  ; positionYOriginal < positionYEnding ; positionXOriginal--,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            else{
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal > positionXEnding ; positionXOriginal--,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
        }

        else if(piece === "kw") {
            let movedXPosition = positionXEnding - positionXOriginal != 0
            let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
            let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
            let ownPiece = colorOfLandingPiece === "w";
            if(ownPiece){
                return false;
            }
            if(movedXPosition) {
                if(!(positionXEnding - positionXOriginal != 1 | (positionYEnding - positionYOriginal != 0 | positionYEnding - positionYOriginal != 1))) {
                    return false;
                }
            }
            else{
                if(!(positionXEnding - positionXOriginal != 1 | positionYEnding - positionYOriginal != 1)) {
                    return false;
                }
            }
        }

        else if(piece === "kb") {
            let movedXPosition = positionXEnding - positionXOriginal != 0
            let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
            let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
            let ownPiece = colorOfLandingPiece === "b";
            if(ownPiece){
                return false;
            }
            if(movedXPosition) {
                if(!(positionXEnding - positionXOriginal != 1 | (positionYEnding - positionYOriginal != 0 | positionYEnding - positionYOriginal != 1))) {
                    return false;
                }
            }
            else{
                if(!(positionXEnding - positionXOriginal != 1 | positionYEnding - positionYOriginal != 1)) {
                    return false;
                }
            }
        }

        else if(piece === "qw") {
            if(positionXEnding == positionXOriginal || positionYEnding == positionYOriginal) {
                let movedXPosition = positionXEnding - positionXOriginal != 0;
            if(positionXEnding - positionXOriginal != 0 && positionYEnding - positionYOriginal != 0) {
                return false;
            }
            if(movedXPosition){
                let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
                if(endingXPositionMoreThanOriginalXPosition) {
                    let currXPosition = positionXOriginal + 1;
                    for(currXPosition ; currXPosition < positionXEnding ; currXPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        console.log(pieceAtCurrentPosition);
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    console.log(ownPiece)
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currXPosition = positionXOriginal - 1;
                    for(currXPosition ; currXPosition > positionXEnding ; currXPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
            else{
                let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
                if(endingYPositionMoreThanOriginalYPosition) {
                    let currYPosition = positionYOriginal + 1;
                    for(currYPosition ; currYPosition < positionYEnding ; currYPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currYPosition = positionYOriginal - 1;
                    for(currYPosition ; currYPosition > positionYEnding ; currYPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
            }
            else{
                let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
            let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
            if(positionXEnding - positionYEnding != positionXOriginal - positionYOriginal && positionXOriginal + positionYOriginal != positionXEnding + positionYEnding) {
                return false;
            }
            if(endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal + 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            else if(endingXPositionMoreThanOriginalXPosition && !endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            else if(!endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal + 1  ; positionYOriginal < positionYEnding ; positionXOriginal--,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            else{
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal > positionXEnding ; positionXOriginal--,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "w";
                if(ownPiece){
                    return false;
                }
            }
            }
        }
        
        else if(piece === "qb") {
            if(positionXEnding == positionXOriginal || positionYEnding == positionYOriginal) {
                let movedXPosition = positionXEnding - positionXOriginal != 0;
            if(positionXEnding - positionXOriginal != 0 && positionYEnding - positionYOriginal != 0) {
                return false;
            }
            if(movedXPosition){
                let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
                if(endingXPositionMoreThanOriginalXPosition) {
                    let currXPosition = positionXOriginal + 1;
                    for(currXPosition ; currXPosition < positionXEnding ; currXPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        console.log(pieceAtCurrentPosition);
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    console.log(ownPiece)
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currXPosition = positionXOriginal - 1;
                    for(currXPosition ; currXPosition > positionXEnding ; currXPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
            else{
                let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
                if(endingYPositionMoreThanOriginalYPosition) {
                    let currYPosition = positionYOriginal + 1;
                    for(currYPosition ; currYPosition < positionYEnding ; currYPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currYPosition = positionYOriginal - 1;
                    for(currYPosition ; currYPosition > positionYEnding ; currYPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
            }
            else{
                let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
            let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
            if(positionXEnding - positionYEnding != positionXOriginal - positionYOriginal && positionXOriginal + positionYOriginal != positionXEnding + positionYEnding) {
                return false;
            }
            if(endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal + 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            else if(endingXPositionMoreThanOriginalXPosition && !endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal + 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal < positionXEnding ; positionXOriginal++,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            else if(!endingXPositionMoreThanOriginalXPosition && endingYPositionMoreThanOriginalYPosition) {
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal + 1  ; positionYOriginal < positionYEnding ; positionXOriginal--,positionYOriginal++) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            else{
                for(positionXOriginal = positionXOriginal - 1, positionYOriginal = positionYOriginal - 1  ; positionXOriginal > positionXEnding ; positionXOriginal--,positionYOriginal--) {
                    let squareAtCurrIndex = document.getElementById(board[positionXOriginal][positionYOriginal].id)
                    let temp = squareAtCurrIndex.getElementsByTagName("img")[0].src;
                    let pieceAtCurrIndex = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                    if(pieceAtCurrIndex != "ty") {
                        return false;
                    }
                }
                let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                let ownPiece = colorOfLandingPiece === "b";
                if(ownPiece){
                    return false;
                }
            }
            }
        }

    
        else if(piece === "rw") {
            let movedXPosition = positionXEnding - positionXOriginal != 0;
            if(positionXEnding - positionXOriginal != 0 && positionYEnding - positionYOriginal != 0) {
                return false;
            }
            if(movedXPosition){
                let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
                if(endingXPositionMoreThanOriginalXPosition) {
                    let currXPosition = positionXOriginal + 1;
                    for(currXPosition ; currXPosition < positionXEnding ; currXPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        console.log(pieceAtCurrentPosition);
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    console.log(ownPiece)
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currXPosition = positionXOriginal - 1;
                    for(currXPosition ; currXPosition > positionXEnding ; currXPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
            else{
                let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
                if(endingYPositionMoreThanOriginalYPosition) {
                    let currYPosition = positionYOriginal + 1;
                    for(currYPosition ; currYPosition < positionYEnding ; currYPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currYPosition = positionYOriginal - 1;
                    for(currYPosition ; currYPosition > positionYEnding ; currYPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "w";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
        }
        else {
            let movedXPosition = positionXEnding - positionXOriginal != 0;
            if(positionXEnding - positionXOriginal != 0 && positionYEnding - positionYOriginal != 0) {
                return false;
            }
            if(movedXPosition){
                let endingXPositionMoreThanOriginalXPosition = positionXEnding > positionXOriginal;
                if(endingXPositionMoreThanOriginalXPosition) {
                    let currXPosition = positionXOriginal + 1;
                    for(currXPosition ; currXPosition < positionXEnding ; currXPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        console.log(pieceAtCurrentPosition);
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    console.log(ownPiece)
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currXPosition = positionXOriginal - 1;
                    for(currXPosition ; currXPosition > positionXEnding ; currXPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[currXPosition][positionYOriginal].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
            else{
                let endingYPositionMoreThanOriginalYPosition = positionYEnding > positionYOriginal;
                if(endingYPositionMoreThanOriginalYPosition) {
                    let currYPosition = positionYOriginal + 1;
                    for(currYPosition ; currYPosition < positionYEnding ; currYPosition++) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    if(ownPiece) {
                        return false;
                    }
                 }
                 else{
                    let currYPosition = positionYOriginal - 1;
                    for(currYPosition ; currYPosition > positionYEnding ; currYPosition--) {
                        let squareAtCurrentPosition = document.getElementById(board[positionXOriginal][currYPosition].id)
                        let temp = squareAtCurrentPosition.getElementsByTagName("img")[0].src;
                        let pieceAtCurrentPosition = temp.substring(temp.indexOf(".svg")-2,temp.indexOf(".svg"));
                        if(pieceAtCurrentPosition !== "ty") {
                            return false;
                        }
                    }
                    let temp = document.getElementById(target.id).getElementsByTagName("img")[0].src
                    let colorOfLandingPiece = temp.substring(temp.indexOf(".svg")-1,temp.indexOf(".svg")-0);
                    let ownPiece = colorOfLandingPiece === "b";
                    if(ownPiece) {
                        return false;
                    }
                 }
            }
        }
        movesSinceEnPessantOpened++;
        return true;
        }
}


