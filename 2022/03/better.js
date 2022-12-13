const { getInputGenerator, inputToArray, readInput } = require('../readInput')
require('../polyfill')

const lines = inputToArray(readInput('./input.txt'))

// returns number
const getScore = letter => {
  const keyCode = letter.charCodeAt(0);
  if(keyCode > 90 ) return keyCode-96;
  return keyCode - 65 + 27;
};

let total = 0;
let groups = 0;
let letters = 0;

const getCommonItem = parts => {
  const item = parts[0]
  for(let j=0;j<item.length;j++){
    letters += 1;
    const candidate = item[j]
    const found = parts.map( x => x.indexOf(candidate) > -1).every( x => !!x)
    if(found){
      return candidate;
    }
  }
  return undefined;
}


for(let i = 0; i< lines.length; i+= 3){
  groups += 1;
  const first = lines[i]
  const second = lines[i+1]
  const third = lines[i+2]
  const firstHalf = first.slice(0,first.length/2)
  const secondHalf = first.slice(first.length/2)
  // const badge = getCommonItem([firstHalf, secondHalf])
  const badge = getCommonItem([first,second,third])
  const score = getScore(badge)
  total += score;
}

console.log({groups, total, letters})
