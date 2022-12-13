const { getInputGenerator, inputToArray, readInput } = require('../readInput')
require('../polyfill')
const { timers } = require('../utils')

// const lines = getInputGenerator('./example.txt')
const lines = getInputGenerator('./input.txt')

//   'A': 'ROCK',
//   'B': "PAPER",
//   'C': 'SCISSORS',

const pointsPerSymbol = {
  "A": 1, 
  "B": 2,
  "C": 3
}

// key wins over value
const winMap = {
  'A': 'C',
  'B': 'A',
  'C': 'B',
}

// inverts the winMap
const loseMap = Object.entries(winMap).reduce(
  (map,[key,value]) => { 
    map[value] = key; 
    return map; 
  },{}
);


// returns boolean or undefined for a tie
const iWon =  (a,b) => {
  if( a === b ) return undefined;
  return loseMap[a] === b;
}

// returns number
const getScore = (theirs,mine) => {
  const won = iWon(theirs,mine)
  const shapePoints = pointsPerSymbol[mine]
  if( won === undefined ) return shapePoints + 3; // tie
  if( won === false )     return shapePoints;     // lose
  if( won === true)       return shapePoints + 6; // win
}

// returns A,B,C
const getMyShape = (theirs,outcome) => {
  switch(outcome){
    case 'Y': return theirs; // tie
    case 'X': return winMap[theirs]; // I lose
    case 'Z': return loseMap[theirs] // I win
  }
}

let total = 0 

const duration = timers.get('duration')

for(const line of lines){
  const [theirs,outcome] = line.split(' ')
  const mine = getMyShape(theirs,outcome)
  const score = getScore(theirs,mine)
  total += score;
}

console.log({ total })
duration.stop();
timers.report();