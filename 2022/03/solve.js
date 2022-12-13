const { getInputGenerator, inputToArray, readInput } = require('../readInput')
require('../polyfill')

// const lines = getInputGenerator('./example.txt')
// const lines = getInputGenerator('./input.txt')
const lines = inputToArray(readInput('./input.txt'))


// returns number
const getScore = letter => {
  const keyCode = letter.charCodeAt(0);
  if(keyCode > 90 ) return keyCode-96;
  return keyCode - 65 + 27;
};

// returns boolean
const includeMatch = (duplicates, limits) => {
  if(duplicates.length === 1) return false;
  let first = false;
  let second = false;
  let third = false;
  const a = limits[0];
  const b = limits[0]+limits[1];
  duplicates.forEach( ({ index }) => {
    if(index < a) first = true;
    if(index >= a && index < b) second = true;
    if(index >= b) third = true;
  })
  return first && second && third; 
}

let total = 0;
let groups = 0;
let letters = 0;

for(let i = 0; i< lines.length; i+= 3){
  groups += 1;
  const line = lines[i].trim() + lines[i+1].trim() + lines[i+2].trim();
  const limits = [lines[i].length,lines[i+1].length]
  const duplicates = new Set();
  line.split('').forEach( item => {
   letters += 1; 
   const matches = Array.from(line.matchAll(item))
    if( includeMatch(matches,limits)){
      duplicates.add(matches[0][0])
    }
  })

  const badge = Array.from(duplicates)[0]
  const score = getScore(badge)
  total += score;

}

console.log({total, groups, letters })
