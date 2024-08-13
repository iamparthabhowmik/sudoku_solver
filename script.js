let arr = [[], [], [], [], [], [], [], [], []];

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
    // console.log(typeof arr[i][j]); //object
  }
}
//  minimum 17 input is needed so we have to count to check for input
let cnt = 0;

let board = [[], [], [], [], [], [], [], [], []];
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    board[i][j] = 0;
  }
}

function FillBoard(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] != 0) {
        arr[i][j].innerText = board[i][j];
      } else arr[i][j].innerText = "";
    }
  }
}

// custom input me board ko unfill kro
function UnFillBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      arr[i][j].innerText = "";
      board[i][j] = 0;
    }
  }
}

let GetPuzzle = document.getElementById("GetPuzzle");
let SolvePuzzle = document.getElementById("SolvePuzzle");

GetPuzzle.onclick = function () {
  cnt = 17;
  const editableDivs = document.querySelectorAll(".clickable");
  editableDivs.forEach((element) => {
    element.setAttribute("contentEditable", "false");
  });
  let xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    let response = JSON.parse(xhrRequest.response);
    // console.log(response)
    board = response.newboard.grids[0].value;
    // console.log(board);
    // console.log(board[0][0]);
    FillBoard(board);
  };
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = encodeURIComponent(
    "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}"
  );
  xhrRequest.open("get", proxyUrl + targetUrl);
  //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
  xhrRequest.send();
};

const editableDivs = document.querySelectorAll(".clickable");
// we only input in div when custom input button is clicked that's why we have to maintain a flag when the div can take input and when not ok that's why I used this flag
let isHandleKeyDownNeedToExecute = false;

function handleKeyDown(event) {
  // Get the key code from the event
  const keyCode = event.keyCode;

  // Check if the pressed key is a number (0-9)
  if (keyCode >= 48 && keyCode <= 57 && isHandleKeyDownNeedToExecute === true) {
    // Find the currently focused div (the one that has focus)
    const focusedDiv = document.activeElement;
    focusedDiv.innerHTML = keyCode - 49 + 1;
    let number = focusedDiv.id;
    let row = Math.floor(number / 9);
    let col = number % 9;
    // console.log(row, col);
    board[row][col] = keyCode - 49 + 1;
    cnt++;
  } else if (
    keyCode >= 97 &&
    keyCode <= 109 &&
    isHandleKeyDownNeedToExecute === true
  ) {
    const focusedDiv = document.activeElement;
    focusedDiv.innerHTML = keyCode - 97 + 1;
    let number = focusedDiv.id;
    let row = Math.floor(number / 9);
    let col = number % 9;
    // console.log(row, col);
    board[row][col] = keyCode - 97 + 1;
    cnt++;
  } else if (
    keyCode == 8 ||
    keyCode == 37 ||
    (keyCode == 39 && isHandleKeyDownNeedToExecute === true)
  ) {
    board[row][col] = 0;
    const focusedDiv = document.activeElement;
    focusedDiv.innerHTML = "";
  }
  // console.log(cnt);
  // Prevent the default behavior of the key (e.g., typing the key in the div)
  event.preventDefault();
}

GetPuzzle2.onclick = function () {
  UnFillBoard();
  isHandleKeyDownNeedToExecute = true;
  cnt = 0;
  // const editableDivs = document.querySelectorAll(".clickable");
  editableDivs.forEach((element) => {
    element.setAttribute("contentEditable", "true");
  });
};
// this a will check for infinite loop because for wrong input code will go in infinite loop
// so we have to stop this. this a will count
let a = 0;
SolvePuzzle.onclick = () => {
  if (cnt < 17) {
    UnFillBoard();
    alert("Wrong Input! Fill atleast 17 cells and fill the cells correctly.");
    cnt = 0;
    isHandleKeyDownNeedToExecute = false;
  } else {
    a = 0;
    sudukoSolver(board, 9);
    FillBoard(board);
  }
};

function sudukoSolver(board, n) {
  let ans = solve(board, n, 0);
  if (ans == false) {
    UnFillBoard();
    a = 0;
    alert("Wrong input typed! Fill again.");
  }
}
function isvalid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (
      board[row][i] === num ||
      board[i][col] === num ||
      board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
        3 * Math.floor(col / 3) + (i % 3)
      ] === num
    ) {
      return false;
    }
  }
  return true;
}

function solve(board, n, fcnt) {
  a++;
  // console.log(a);
  if (a >= 1000000) return false; //for infinite loop
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isvalid(board, i, j, num) == true) {
            board[i][j] = num;

            if (solve(board, n, fcnt + 1) == true) {
              return true;
            }

            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
