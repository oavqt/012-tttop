//Tic Tac Toe

const pubsub = (() => {
  let pubsub = {};

  function subscribe(evt, fn) {
    pubsub[evt] = pubsub[evt] || [];
    pubsub[evt].push(fn);
  }

  function unsubscribe(evt, fn) {
    if (pubsub[evt]) {
      for (let u = 0; u < pubsub[evt].length; u++) {
        if (pubsub[evt][u] === fn) {
          pubsub[evt].splice(u, 1);
          break;
        }
      }
    }
  }

  function publish(evt, data) {
    if (pubsub[evt]) {
      pubsub[evt].forEach((fn) => {
        fn(data);
      });
    }
  }

  return { subscribe, unsubscribe, publish };
})();

const display = (() => {
  let player = 'O';
  let vs = 'computer';

  //cache DOM
  const board = document.querySelector('.board__grid');
  const squares = [...document.querySelectorAll('.board__square')];
  const result = document.querySelector('.board__result');
  const resultPlayer = document.querySelector('.result__player');
  const resultText = document.querySelector('.result__message');
  const scores = [...document.querySelectorAll('.player__score')];
  const btns = [...document.querySelectorAll('.btn')];
  const message = document.querySelector('.board__message');
  const select = document.querySelector('.information__select');

  //Functions

  function square() {
    if (this.textContent !== '') {
      return;
    } else {
      this.textContent = player;
      this.classList.add('board__square--active');

      message.textContent = '';

      pubsub.publish('board', squares);

      if (select.value === 'player') {
        if (player === 'O') {
          player = 'X';

          message.textContent = 'X turn';
        } else {
          player = 'O';

          message.textContent = 'O turn';
        }
      }
    }
  }

  function btn() {
    if (this.className === 'btn btn--o') {
      player = 'O';

      btns[0].disabled = true;
      btns[1].disabled = true;

      message.textContent = '';

      addSquareEventAndReset();
      pubsub.publish('restart', true);
    } else if (this.className === 'btn btn--x') {
      player = 'X';

      btns[0].disabled = true;
      btns[1].disabled = true;

      message.textContent = '';

      addSquareEventAndReset();
      pubsub.publish('restart', true);
      pubsub.publish('player', player);
      pubsub.publish('setComputetToFirst', true);
    } else if (
      this.className === 'btn btn--restart' ||
      this.className === 'board__result board__result--active'
    ) {
      player = 'O';

      btns[0].disabled = false;
      btns[1].disabled = false;

      board.classList.remove('board__grid--active');

      result.classList.remove('board__result--active');

      message.textContent = 'Restarting';

      setTimeout(() => {
        board.classList.add('board__grid--alt');

        addSquareEventAndReset();

        message.textContent = 'Start game or select player';
      }, 1000);

      board.classList.remove('board__grid--alt');

      pubsub.publish('restart', true);
    }
  }

  function score(count) {
    scores[0].textContent = count[0];
    scores[1].textContent = count[1];
  }

  function vSComputerOrPlayer() {
    player = 'O';

    if (this.value === 'player') {
      vs = 'player';
    } else {
      vs = 'computer';
    }

    addSquareEventAndReset();
    pubsub.publish('vs', vs);
    pubsub.publish('restart', true);
  }

  function showComputerChoice(position) {
    for (let u = 0; u < squares.length; u++) {
      if (
        +squares[u].dataset['row'] === position[0] &&
        +squares[u].dataset['column'] === position[1]
      ) {
        removeSquareEvent();

        setTimeout(() => {
          squares[u].classList.add('board__square--active');

          if (player === 'X') {
            squares[u].textContent = 'O';
          } else {
            squares[u].textContent = 'X';
          }

          addSquareEvent();
        }, 1000);
      }
    }
  }

  function endTheGame(winner) {
    removeSquareEvent();

    btns[2].disabled = true;

    if (winner === 'O') {
      resultPlayer.textContent = winner;
      resultText.textContent = 'Winner!';
    } else if (winner === 'X') {
      resultPlayer.textContent = winner;
      resultText.textContent = 'Winner!';
    } else {
      resultPlayer.textContent = 'OX';
      resultText.textContent = 'Draw!';
    }

    setTimeout(() => {
      board.classList.add('board__grid--active');
      result.classList.add('board__result--active');

      message.textContent = 'Click to restart';

      btns[2].disabled = false;
    }, 1000);
  }

  //Events
  function removeSquareEvent() {
    squares.forEach((item) => {
      item.removeEventListener('click', square);
    });
  }

  function addSquareEvent() {
    squares.forEach((item) => {
      item.addEventListener('click', square);
    });
  }

  function addSquareEventAndReset() {
    squares.forEach((item) => {
      item.textContent = '';
      item.classList.remove('board__square--active');
      item.addEventListener('click', square);
    });
  }

  addSquareEvent();

  btns.forEach((item) => {
    item.addEventListener('click', btn);
  });

  select.addEventListener('change', vSComputerOrPlayer);

  result.addEventListener('click', btn);

  pubsub.subscribe('endTheGame', endTheGame);
  pubsub.subscribe('score', score);
  pubsub.subscribe('showComputerChoice', showComputerChoice);
})();

const board = (() => {
  let board = [
    ['[0][0]', '[0][1]', '[0][2]'],
    ['[1][0]', '[1][1]', '[1][2]'],
    ['[2][0]', '[2][1]', '[2][2]'],
  ];

  let winner = '';
  let player0Score = 0;
  let playerXScore = 0;
  let stop = 'no';

  //Functions
  function insertXOToBoard(xOrO) {
    for (let u = 0; u < xOrO.length; u++) {
      if (xOrO[u].textContent !== '') {
        board[xOrO[u].dataset['row']][xOrO[u].dataset['column']] =
          xOrO[u].textContent;
      }
    }

    scanTheBoard();

    if (stop === 'no') {
      pubsub.publish('startComputer', board);
    }
  }

  function setComputetToFirst(tOrF) {
    if (tOrF === true) {
      pubsub.publish('startComputer', board);
    }
  }

  function scanTheBoard() {
    //Horizontal
    if (board[0][0] === board[0][1] && board[0][0] === board[0][2]) {
      if (board[0][0] === 'O') {
        winner = 'O';
      } else if (board[0][0] === 'X') {
        winner = 'X';
      }
    } else if (board[1][0] === board[1][1] && board[1][0] === board[1][2]) {
      if (board[1][0] === 'O') {
        winner = 'O';
      } else if (board[1][0] === 'X') {
        winner = 'X';
      }
    } else if (board[2][0] === board[2][1] && board[2][0] === board[2][2]) {
      if (board[2][0] === 'O') {
        winner = 'O';
      } else if (board[2][0] === 'X') {
        winner = 'X';
      }
    }
    //Vertical
    if (board[0][0] === board[1][0] && board[0][0] === board[2][0]) {
      if (board[0][0] === 'O') {
        winner = 'O';
      } else if (board[0][0] === 'X') {
        winner = 'X';
      }
    } else if (board[0][1] === board[1][1] && board[0][1] === board[2][1]) {
      if (board[0][1] === 'O') {
        winner = 'O';
      } else if (board[0][1] === 'X') {
        winner = 'X';
      }
    } else if (board[0][2] === board[1][2] && board[0][2] === board[2][2]) {
      if (board[0][2] === 'O') {
        winner = 'O';
      } else if (board[0][2] === 'X') {
        winner = 'X';
      }
    }
    //Diagonal
    if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      if (board[0][0] === 'O') {
        winner = 'O';
      } else if (board[0][0] === 'X') {
        winner = 'X';
      }
    } else if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      if (board[0][2] === 'O') {
        winner = 'O';
      } else if (board[0][2] === 'X') {
        winner = 'X';
      }
    }

    if (winner !== '' || boardIsFilled() === true) {
      stop = 'yes';

      if (winner === 'O') {
        player0Score++;
      } else if (winner === 'X') {
        playerXScore++;
      }

      pubsub.publish('score', [player0Score, playerXScore]);
      pubsub.publish('endTheGame', winner);
    } else {
      stop = 'no';
    }
  }

  function boardIsFilled() {
    let check = true;
    for (let row = 0; row < board.length; row++) {
      for (let column = 0; column < board[row].length; column++) {
        if (board[row][column].length > 1) {
          check = false;
        }
      }
    }
    return check;
  }

  function restart(tOrF) {
    if (tOrF === true) {
      board = [
        ['[0][0]', '[0][1]', '[0][2]'],
        ['[1][0]', '[1][1]', '[1][2]'],
        ['[2][0]', '[2][1]', '[2][2]'],
      ];

      winner = '';
    }
  }

  //Events
  pubsub.subscribe('board', insertXOToBoard);
  pubsub.subscribe('restart', restart);
  pubsub.subscribe('computerBoardCheck', scanTheBoard);
  pubsub.subscribe('setComputetToFirst', setComputetToFirst);

  return board;
})();

const computer = (() => {
  let type = 'computer';
  let computer = 'X';

  //Functions
  function vs(pOrC) {
    if (pOrC === 'player') {
      type = 'player';
    } else {
      type = 'computer';
    }
  }

  function changeToO(xOrO) {
    if (xOrO === 'X') {
      computer = 'O';
    }
  }

  function random(board) {
    if (type === 'computer') {
      for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
          if (board[row][column].length > 1) {
            while (true) {
              let rows = Math.floor(Math.random() * (3 - 0) + 0);
              let columns = Math.floor(Math.random() * (3 - 0) + 0);

              if (
                board[rows][columns] !== 'O' &&
                board[rows][columns] !== 'X'
              ) {
                board[rows][columns] = computer;

                pubsub.publish('showComputerChoice', [rows, columns]);
                pubsub.publish('computerBoardCheck', board);

                return;
              }
            }
          }
        }
      }
    }
  }

  //Events
  pubsub.subscribe('vs', vs);
  pubsub.subscribe('startComputer', random);
  pubsub.subscribe('player', changeToO);
})();

//
