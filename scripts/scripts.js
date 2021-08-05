//Tic Tac Toe

const display = (() => {
  let person = 'O';

  //cache DOM
  const cards = [...document.querySelectorAll('.board__card')];
  const scores = [...document.querySelectorAll('.player__score')];
  const btns = [...document.querySelectorAll('.btn')];
  const message = document.querySelector('.message__current');

  //Functions
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

      cards.forEach((item) => {
        item.textContent = '';
      });

      message.textContent = 'Start game or select player';
    }
  }

  function card() {
    if (this.textContent !== '') this.disabled;
    else this.textContent = person;

    message.textContent = '';
  }

  //Events
  btns.forEach((item) => {
    item.addEventListener('click', btn);
  });

  cards.forEach((item) => {
    item.addEventListener('click', card);
  });

  return cards;
})();

//
