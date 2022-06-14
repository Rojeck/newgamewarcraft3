/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */
const startBtn = document.querySelector('.start'),
    fightBtn = document.querySelector('.fight'),
    charactersList = document.querySelector('.characters-list'),
    battleField = document.querySelector('.battle-field');


const unitDB = [
    ['https://c.tenor.com/Cmu6ZaHlcsgAAAAd/hoodwink-dota.gif',
    'Hoodwink',
    325,
    12,
    1.4,
    28,
    1],
    ['https://i.pinimg.com/originals/d4/56/36/d45636e9985a47abda2efbd3a72660d1.gif',
    'Bloodseeker',
    525,
    6,
    2.1,
    34,
    2],
    ['https://c.tenor.com/S17uU3gXWiAAAAAd/sniper-dota2.gif',
    'Sniper',
    500,
    2,
    0.5,
    28,
  3],
    ['https://steamuserimages-a.akamaihd.net/ugc/833575151656227957/86FB5B0DB56BA0AA9B05010C4AD1A2A59CE7B573/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
    'Riki',
    325,
    8,
    0.9,
    36,
  4],
    ['https://c.tenor.com/XVQwfffnvm4AAAAd/venomancer-gaming.gif',
    'Veno',
    325,
    4,
    1.1,
    42,
  5],
    ['https://steamuserimages-a.akamaihd.net/ugc/96108327079997595/AA8D3E316EA71C7F7440FE9B269737E3C2C86397/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
    'Tinker',
    400,
    3,
    1.3,
    75,
  6],
    ['https://64.media.tumblr.com/7f6662a50401bbb500571261d20377fc/tumblr_o6txq0K8el1s58c1so3_500.gifv',
    'Windranger',
    325,
    7,
    1.8,
    95,
  7],
    ['https://i.gifer.com/90WG.gif',
    'Axe',
    600,
    2,
    1.2,
    52,
  8]
]

// get a random number

function randomInteger(min, max) {
  let rec = Math.floor(Math.random() * (max - min + 1)) + min;
  return rec;
}

class Unit {
    constructor (imgUrl, name, health, armor, attackSpeed, damage, id){
        this.imgUrl = imgUrl;
        this.name = name;
        this.health = health,
        this.armor = armor;
        this.attackSpeed = attackSpeed;
        this.damage = damage;
        this.id = id;
    }
    createCard (fight) {
        const card = document.createElement('div');
        let isHidden;
        if (fight){
            isHidden = 'hidden';
            card.classList.add(`big`);
        } else {
            isHidden = ''; 
        }
        card.innerHTML = `
          <div class="character-img">
            <img src="${this.imgUrl}" alt="hero">
          </div>
          <div class="name">${this.name}</div>
          <div class="health-line-background ${isHidden}">
            <div class="health-line ${isHidden}"></div>
          </div>
          <div class="health-number">
            ${this.health} HP
          </div>
          <div class="properties">
            <div class="property">
              <img src="https://static.thenounproject.com/png/3083874-200.png" alt="armor">
              <span>${this.armor}</span>
            </div>
            <div class="property">
              <img src="https://cdn-icons-png.flaticon.com/512/231/231640.png" alt="damage">
              <span>${this.damage}</span>
            </div>
            <div class="property">
              <img src="https://cdn-icons-png.flaticon.com/512/72/72199.png" alt="speed">
              <span>${this.attackSpeed}</span>
            </div>
          </div>
        `
        card.dataset.id = this.id;
        card.classList.add(`card`);
        
        return card;
    }
}
class Display {
    fillCharacterList (){
        unitDB.forEach(element => {
            let unit = new Unit(...element);
            charactersList.append(unit.createCard(true));
        });
    }
    addListeners() {
        const cards = document.querySelectorAll('.card');
        console.log(cards);
        cards.forEach(element => {
            element.addEventListener('click', () => {
                cards.forEach(element => {
                  element.classList.remove('blackFrame');
                })
                  element.classList.add('blackFrame');
                  startBtn.classList.remove('hidden');
            })
        })
    }
    createGameField () {
      battleField.innerHTML = '';
      charactersList.classList.add('hidden');
      startBtn.classList.add('hidden');
      fightBtn.classList.remove('hidden');
      battleField.classList.remove('hidden');
      getPlayers().forEach(element => {
        let unit = new Unit(...element);
        battleField.append(unit.createCard(false));
      });
    }   
}

class Game {
  constructor(player1, player2){
       this.player1 = {},
       this.player2 = {},
       this.player1.health = player1[2],
       this.player1.armor = player1[3];
       this.player1.attackSpeed = player1[4];
       this.player1.damage = player1[5];
       this.player1.id = player1[6];
       this.player2.health = player2[2],
       this.player2.armor = player2[3];
       this.player2.attackSpeed = player2[4];
       this.player2.damage = player2[5];
       this.player2.id = player2[6];    
  }
  gameEnd () {
    battleField.innerHTML = '';
    battleField.classList.add('hidden');
    fightBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    charactersList.classList.remove('hidden');
  }
  changeHP (player) {
    const playerHPfield = document.querySelectorAll(`[data-id='${this[player].id}'] .health-number`);
    if (this[player].health <= 0) {
      playerHPfield[1].innerHTML = '0 HP'
    } else {
      playerHPfield[1].innerHTML = `${this[player].health} HP`;
    }
  }
  attack (player) {
    let enemy;
    if (player === 'player1') {
      enemy = 'player2';
    } else {
      enemy = 'player1';
    }
    this[enemy].health = this[enemy].health - (this[player].damage - this[player].armor);
  }
  checkVictory (){
    if (this.player1.health <= 0 || this.player2.health <= 0) {
      return true;
    } else {
      return false;
    }
  }
  startGameLoop (){
    let timerPlayer1 = setInterval(() => {
      this.attack('player1');
      this.changeHP('player2');
      setTimeout(() => {
        if (this.checkVictory()) {
          clearInterval(timerPlayer1);
          clearInterval(timerPlayer2);
          alert(`You Won!`)
          this.gameEnd();
        }
      },0);
    }, this.player1.attackSpeed*1000);
    let timerPlayer2 = setInterval(() => {
      this.attack('player2');
      this.changeHP('player1');
      setTimeout(() => {
        if (this.checkVictory()) {
          clearInterval(timerPlayer1);
          clearInterval(timerPlayer2);
          alert(`Computer Won!`)
          this.gameEnd();
        }
      }, 0);
    }, this.player2.attackSpeed*1000);
  }
}
let globalPlayers;
function getPlayers (){
  const cards = document.querySelectorAll('.card');
  let selectedEl;
  let _system = true;
  let randomNum;
  for (let value of cards){
    if (value.classList.contains('blackFrame')) {
      selectedEl = value;
    }
  }
  while (_system) {
    randomNum = randomInteger(1,unitDB.length);
    if (randomNum !== +selectedEl.dataset.id){
      break;
    }
  }
  const players = [unitDB.find(element => element[element.length-1] === +selectedEl.dataset.id
  ), unitDB.find(element => element[element.length-1] === randomNum )]
  globalPlayers = players;
  return players;
}
startBtn.classList.add('hidden');
const display = new Display();
startBtn.addEventListener('click', () => {
  charactersList.classList.add()
  display.createGameField();
});
display.fillCharacterList();
display.addListeners();
fightBtn.addEventListener('click', () => {
  const [player1,player2] = globalPlayers;
  const game = new Game(player1, player2);
  fightBtn.classList.add('hidden');
  game.startGameLoop();
});


