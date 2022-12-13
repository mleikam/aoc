const { readInput,inputToArray } = require('../readInput')
require('../polyfill')
const { timers, makeNeighborIndexes } = require('../utils')

let input = readInput();
// input = readInput('./example.txt')

const ROUNDS = 50;
const PADDING = 3;

const a = input.replaceAll("\r","\n").indexOf("\n\n")
const algorithm = input.slice(0,a).split('');
const rows = input.slice(a).trim();

const data = inputToArray(rows).map( row => row.split('') );

const gridX = data[0].length;
const gridY = data.length; 

let current = new Map();

const coord2key = coord => coord.join(',');

const key2coord = key => {
  const comma = key.indexOf(',')
  const x = parseInt(key.slice(0,comma),10);
  const y = parseInt(key.slice(comma+1),10);
  return [x,y];
}

data.forEach( (row, rowIndex) => {
  row.forEach( (cell, colIndex) => {
    const key = coord2key([colIndex,rowIndex]);
    const value = (data[rowIndex][colIndex] === '#')
    current.set(key,value)
  })
})

const countLitPixels = map => {
  let count = 0;
  for([key,pixel] of map.entries()){
    const [x,y] = key2coord(key);
    if(
      pixel && 
      x >= -ROUNDS && 
      x < gridX + ROUNDS &&
      y >= -ROUNDS && 
      y < gridY + ROUNDS
    ){
      count += 1; 
    }
  }
  return count;
}

const getKeysToCheck = ([x,y]) => {
  const coordsToCheck = [];
  for(let j=-1;j<=1;j++){
    for(let k=-1;k<=1;k++){
      coordsToCheck.push(`${x+k},${y+j}`);
    }
  }
  return coordsToCheck  
}

const getBinary = (keys,map) => {
  const timer = timers.get('binary')
  const b = keys.reduce( (binary,k) => {
    binary += map.get(k) ? '1' : '0'
    return binary; 
  },'');
  timer.stop()
  return b;
}

const isLit = binary => algorithm[parseInt(binary,2)] === '#';

const render = map => {
  let s = '';
  for(y=(-ROUNDS-PADDING);y<gridY + (PADDING+ROUNDS);y++){
    for(let x=(-ROUNDS-PADDING);x<gridX + (PADDING+ROUNDS); x++){
      const value = map.get(coord2key([x,y])) ? '#' : '.';
      s += value;
    }
    s += "\n"
  }
  console.log(s)
}

const duration = timers.get('duration')

for(let i=0;i<ROUNDS;i++){
  const visited = new Set();
  const next = new Map();
  const roundTimer = timers.get('round')
  for(let y = (-1*ROUNDS)-(11*(ROUNDS/10)); y <= gridY+ROUNDS+PADDING+(13*(ROUNDS/10)); y++){
    for(let x = (-1*ROUNDS)-(3*(ROUNDS/10)); x <= gridX+ROUNDS+(2*(ROUNDS/10)); x++){
      const key = coord2key([x,y]);
      if( visited.has(key) ) continue;
      const keys = getKeysToCheck([x,y]);      
      const lit = isLit(getBinary(keys,current));
      next.set(key,lit);
      visited.add(key);
    }
  }
  roundTimer.stop()
  current = next;
}


render(current)
console.log({generations: ROUNDS, gridX,gridY})
const litPixels = countLitPixels(current);
console.log({litPixels})

duration.stop();
// part 1
// 5379 is just right

// part 2 
// 17917

timers.report();
