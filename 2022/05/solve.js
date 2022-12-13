const { readInput } = require('../readInput')

const lines = readInput('./input.txt').split("\n")
// const lines = readInput('./example.txt').split("\n")

const stacks = [];

const makeStack = (line) => {
  for(let i=0;i<line.length;i+=4){
    const index = i/4
    if(!Array.isArray(stacks[index])) stacks[index] = []
    const crate = line.substring(i,i+4)
      .replace('[','')
      .replace(']','')
      .trim()
    if(crate !== '') stacks[index].unshift(crate)
  }
}

const moveCrate = (from,to) => {
  const crate = stacks[from-1].pop();
  stacks[to-1].push(crate);
}

// part 1
const doMove1 = line => {
  const [count,from,to] = Array.from(line.matchAll(/(\d+)/g)).map( match => parseInt(match[1],10));
  for(let i=0;i<count;i++){
    moveCrate(from,to)
  }
}

// part 2
const doMove2 = line => {
  const [count,from,to] = Array.from(line.matchAll(/(\d+)/g)).map( match => parseInt(match[1],10));
  const crates = stacks[from-1].splice(stacks[from-1].length-count,count)
  stacks[to-1] = stacks[to-1].concat(crates)
}

const getTop = () => {
  return stacks.map( stack => stack.pop() ).join('')
}

for(const line of lines){
  if(line.indexOf('[') > -1) makeStack(line)
  if(line.indexOf('move') > -1) doMove2(line)
}

// console.log({stacks})
const topOfStacks = getTop(stacks)
console.log(topOfStacks)
