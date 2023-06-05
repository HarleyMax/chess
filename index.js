//Grab the squares and the icons
let squares = document.getElementsByClassName("squares");
let icons = document.getElementsByClassName("icons");


//Initialize the chess board as an array
let board = new Array(8);
let currIndex = 0;
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(8);
  }
for(let i = 0 ; i < 8 ; i++) {
    for(let j = 0 ; j < 8 ; j++) {
        board[i][j] = squares[currIndex];
        currIndex++;
    }
}


