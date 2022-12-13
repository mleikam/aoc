const { readInput,inputToArray } = require('../readInput')
require('../polyfill')
const { timers, mod1 } = require('../utils')

const rows = inputToArray(readInput());
let playerPositions = rows.map( row => parseInt(row.split(':').pop(),10));
playerPositions = [4,8]

const startingPositions = [...playerPositions]

const playerScores = [0,0]

const BOARD_SIZE = 10
const ROLLS_PER_TURN = 3; 
const POINTS_TO_WIN = 1000;
// const POINTS_TO_WIN = 21;

let rollCounter = 0;

// const deterministicDie = () => mod1(rollCounter+1,3);
const deterministicDie = () => mod1(rollCounter+1,100);

const playerHasWon = (index) => (playerScores[index]+ playerPositions[index]) >= POINTS_TO_WIN; 

const getNextPosition = (playerIndex,rollDie) => {
  let increment  = 0
  for(i=0;i<ROLLS_PER_TURN;i++){
    increment += rollDie();
    rollCounter += 1;
  }
  return increment;
}

const playTurn = (playerIndex,rollDie) => {

  const move = getNextPosition(playerIndex,rollDie)
  const newPosition = mod1(( playerPositions[playerIndex] + move), BOARD_SIZE);
  playerPositions[playerIndex] = newPosition
  const won = playerHasWon(playerIndex)
  if(won){
    console.log(`player ${playerIndex} won with:`,{rollCounter, i,move, newPosition, playerScores})
    playerScores[playerIndex] += newPosition;
    return true;
  }
  playerScores[playerIndex] += playerPositions[playerIndex];
  console.log(`${rollCounter}, player ${playerIndex} rolls ${move}, moving to ${playerPositions[playerIndex]} for a score of ${playerScores[playerIndex]}`)
  return false;
}


for(let turn=0;turn<400;turn++){
  let i = turn % 2;
  const won = playTurn(i,deterministicDie)
  if(won){
    break;
  }
}
console.log({ startingPositions, playerPositions, playerScores, rollCounter})
const losingScore = playerScores.sortNumeric().pop();
console.log({part1: losingScore * rollCounter})
// 551901
