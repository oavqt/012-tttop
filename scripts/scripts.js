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
  let person = 'O';

  //cache DOM
  const board = document.querySelector('.board__grid');
  const squares = [...document.querySelectorAll('.board__square')];
  const result = document.querySelector('.board__result');
  const resultPlayer = document.querySelector('.result__player');
  const resultText = document.querySelector('.result__message');
  const scores = [...document.querySelectorAll('.player__score')];
  const btns = [...document.querySelectorAll('.btn')];
  const message = document.querySelector('.board__message');

  //Functions
  function square() {
    if (this.textContent !== '') {
      this.disabled;
    } else {
      (this.textContent = person), this.classList.add('board__square--active');
    }

    pubsub.publish('board', squares);
  }

  function btn() {
    if (this.className === 'btn btn--o') {
      person = 'O';

      btns[0].disabled = true;
      btns[1].disabled = true;

      message.textContent = '';
    } else if (this.className === 'btn btn--x') {
      person = 'X';

      btns[0].disabled = true;
      btns[1].disabled = true;

      message.textContent = '';
    } else {
      person = 'O';

      btns[0].disabled = false;
      btns[1].disabled = false;

      squares.forEach((item) => {
        item.textContent = '';
      });

      message.textContent = 'Start game or select player';
    }

    if (this.className === 'btn btn--restart') {
      board.classList.remove('board__grid--active');
      result.classList.remove('board__result--active');

      pubsub.publish('restart', true);
    }
  }

  function end(data) {
    board.classList.add('board__grid--active');
    result.classList.add('board__result--active');

    if (data === 'O') {
      resultPlayer.textContent = data;
      resultText.textContent = 'Winner!';
    } else if (data === 'X') {
      resultPlayer.textContent = data;
      resultText.textContent = 'Winner!';
    } else {
      resultPlayer.textContent = 'OX';
      resultText.textContent = 'Draw!';
    }
  }

  function score(count) {
    scores[0].textContent = count[0];
    scores[1].textContent = count[1];
  }

  //Events
  squares.forEach((item) => {
    item.addEventListener('click', square);
  });

  btns.forEach((item) => {
    item.addEventListener('click', btn);
  });

  pubsub.subscribe('end', end);
  pubsub.subscribe('score', score);
})();

const board = (() => {
  let board = [
    ['[0][0]', '[0][1]', '[0][2]'],
    ['[1][0]', '[1][1]', '[1][2]'],
    ['[2][0]', '[2][1]', '[2][2]'],
  ];

  let winner = '';
  let countO = 0;
  let countX = 0;

  //Functions
  function populate(data) {
    for (let u = 0; u < data.length; u++) {
      if (data[u].textContent !== '') {
        board[data[u].dataset['row']][data[u].dataset['column']] =
          data[u].textContent;
      }
    }

    checkBoard();
  }

  function checkBoard() {
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

    if (winner !== '' || isBoardFull() === true) {
      if (winner === 'O') {
        countO++;
      } else {
        countX++;
      }
      pubsub.publish('score', [countO, countX]);
      pubsub.publish('end', winner);
    }
  }

  function isBoardFull() {
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

  function restart(data) {
    if (data === true) {
      board = [
        ['[0][0]', '[0][1]', '[0][2]'],
        ['[1][0]', '[1][1]', '[1][2]'],
        ['[2][0]', '[2][1]', '[2][2]'],
      ];

      winner = '';
    }
  }

  //Events
  pubsub.subscribe('board', populate);
  pubsub.subscribe('restart', restart);
})();
//
