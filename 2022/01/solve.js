const { getInputGenerator } = require('../readInput')
require('../polyfill')

// const lines = getInputGenerator('./example.txt')
const lines = getInputGenerator('./input.txt')

let topElves = [0]
let elf = 0

const maybeMakeTopElf = elf => {
  for(let i=0;i<topElves.length; i++){
    const e = topElves[i]
    if(elf > e) {
      topElves.splice(i,0,elf)
      break;
    }
  }
  topElves = topElves.slice(0,3)
}

for(const line of lines){
  if(elf > 0 && line === ''){
    maybeMakeTopElf(elf)
    elf = 0;
  } else {
    elf += parseInt(line.trim(),10)
  }
}

console.log({ topElves }, topElves.sum() )