const { inputToArray, readInput } = require('../readInput')

// const lines = inputToArray(readInput('./example-part2.txt'))
const lines = inputToArray(readInput('./input.txt'))

// given a direction, how do the coords change?
const directionMap = {
  'U': [0,1],
  'D': [0,-1],
  'L': [-1,0],
  'R': [1,0]
}

const moveThreshold = Math.sqrt(2)

const visited = new Set();
let head = [0,0]
const tails = [
  [0,0],
  [0,0],
  [0,0],
  [0,0],
  [0,0],
  [0,0],
  [0,0],
  [0,0],
  [0,0],
]
const min = [0,0];
const max = [0,0];

const applyAdjustments = (knot,adjustments) => {
  adjustments.forEach((a,i) => {
    knot[i] += a;
  });
}

const getDistance = (a,b) => {
  if(a < b) return b-a;
  if(b < a ) return a-b;
  return 0;
}

// returns an [x,y] pair of coordinate adjustments needed
// to keep the first touching the second
const getAdjustments = (r,s) => {
  const a = getDistance(r[0],s[0])
  const b = getDistance(r[1],s[1])
  const distance = Math.sqrt(a**2 + b**2)

  const adjustments = [0,0];
  if(distance <= moveThreshold) return adjustments;

  if( r[0] < s[0]) adjustments[0] = 1;
  if( r[0] > s[0]) adjustments[0] = -1;
  if( r[1] < s[1]) adjustments[1] = 1;
  if( r[1] > s[1]) adjustments[1] = -1;

  return adjustments;
}

const follow = (knot,target) => {
  applyAdjustments(knot,getAdjustments(knot,target))
}

const recordPosition = (x) => {
  
}

const getGraphMarker = (a,b,x,y) => {
  let marker = '.'
  if(Array.isArray(b)){
    if(b[0] == x && b[1] === y) marker = markers[1]
  }
  if(Array.isArray(a)){
    if(a[0] == x && a[1] === y) marker = markers[0]
  }
  if( !Array.isArray(a) && ! Array.isArray(b)){
    marker = visited.has(`${x},${y}`) ? '#' : '.'
  }
  return marker;  
}

const graph = (a,b) => {
  const markers = ['H','T']
  const [minX,minY] = min;
  const [maxX,maxY] = max;
  let g = ''
  for(let y=maxY+1;y>=minY-1;y--){
    for(let x=minX-1;x<=maxX+1;x++){
      g += getGraphMarker(a,b,x,y);
    }
    g += "\n"
  }
  console.log(g)
}

for(const line of lines){
  const [direction,countStr] = line.split(' ');
  let count = parseInt(countStr,10)
  while(count > 0){
    applyAdjustments(head,directionMap[direction]);
    follow(tails[0],head)
    for(let ti=1;ti<tails.length;ti++){
      follow(tails[ti],tails[ti-1])
    }
    recordPosition(tails[tails.length-1])
    count -= 1; 
  }
}

graph()
// console.log(visited)
console.log(visited.size)
console.log({ min, max })
