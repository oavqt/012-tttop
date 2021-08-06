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
  let person = '';

  //cache DOM
  const squares = [...document.querySelectorAll('.board__square')];
  const scores = [...document.querySelectorAll('.player__score')];
  const btns = [...document.querySelectorAll('.btn')];
  const message = document.querySelector('.message__current');

  //Functions
  function square() {
    if (this.textContent !== '') this.disabled;
    else this.textContent = person;

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

      square.forEach((item) => {
        item.textContent = '';
      });

      message.textContent = 'Start game or select player';
    }
  }

  //Events
  squares.forEach((item) => {
    item.addEventListener('click', square);
  });

  btns.forEach((item) => {
    item.addEventListener('click', btn);
  });
})();

const board = (() => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  pubsub.subscribe('board', populate);

  function populate(data) {
    for (let u = 0; u < data.length; u++) {
      board[data[u].dataset['row']][data[u].dataset['column']] =
        data[u].textContent;
    }
  }
})();
//
