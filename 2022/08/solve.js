const { inputToArray, readInput } = require('../readInput')
require('../polyfill')

const lines = inputToArray(readInput('./input.txt'))

const grid = lines.map( row => row.split(''));
const rows = lines.length;
const cols = grid[0].length;

const findSkyscrapers = (i,row,reverse,vertical) => {
  let highest = -1;
  let score = 0;
  const seen = []
  const sortedRow = reverse ? [...row].reverse() : row; 
  sortedRow.forEach( (digit,j) => {
    const x = reverse ? row.length-1-j: j;
    const coord = vertical ? `${i},${x}` : `${x},${i}`;
    if(digit > highest){ 
      score += 1
      highest = digit;
      seen.push(coord)
    };
  })
  return seen;
}

const allTrees = new Set();

const trackAllTrees = (newTrees) => {
  newTrees.forEach( t => allTrees.add(t))
}

const lookHorizontal = () => {
  for(let i=0;i<lines.length;i+=1){
    const row = grid[i]
    const ltr = findSkyscrapers(i,row,false,false)
    trackAllTrees(ltr)
    const rtl = findSkyscrapers(i,row,true,false)
    trackAllTrees(rtl)
  }
}

const lookVertical = () => {
  for(let c=0;c<cols;c++){
    const row = []
    for(let r=0;r<rows;r++){
      row.push(grid[r][c]) 
    }
    const ltr = findSkyscrapers(c,row,false,true)
    trackAllTrees(ltr)
    const rtl = findSkyscrapers(c,row,true,true)
    trackAllTrees(rtl)
  }
}

lookHorizontal();
lookVertical();

console.log(allTrees.size)
