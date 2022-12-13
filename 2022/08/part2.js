const { inputToArray, readInput } = require('../readInput')
require('../polyfill')
const { makeNeighborIndexes , INVALID } = require('../utils')

const lines = inputToArray(readInput('./input.txt'))

const grid = lines.map( row => row.split(''));
const rows = lines.length;
const cols = grid[0].length;

const strip = lines.join('')
const getNeighbors = makeNeighborIndexes(rows,rows*cols,false);

const n = s => parseInt(s,10)

const countTrees = (index,maxHeight,directionIndex, count = 0) => {
  const j = getNeighbors(index)[directionIndex]
  if(j === INVALID ) return count;
  const h = n(strip.charAt(j));
  if( h < maxHeight){
    return countTrees(j,maxHeight,directionIndex,count+1)
  }
  return count+1;
}

let topScore = 0 
for(let i=0;i<strip.length;i++){
  const candidate = n(strip.charAt(i))
  const up = countTrees(i,candidate,0)
  const down = countTrees(i,candidate,1)
  const left = countTrees(i,candidate,2)
  const right = countTrees(i,candidate,3)
  const score = [up,down,left,right].product();
  if(score > topScore){
    topScore = score;
  }
}

console.log({ topScore })