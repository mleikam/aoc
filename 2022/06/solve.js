const { inputToArray, readInput } = require('../readInput')

const input = readInput('./input.txt');

const charactersAreUnique = chars => chars.split('').reduce((acc,c,index) => {
  const rest = chars.substring(index+1)
  if(rest.indexOf(c) > -1) acc = false;
  return acc;
}, true)

// const SIZE = 4; // part 1
const SIZE = 14; // part 2

for(let i=SIZE;i<input.length;i++){
  const test = input.substring(i-SIZE,i)
  if( charactersAreUnique(test,i) ) {
    console.log(i)
    break;
  }
}
