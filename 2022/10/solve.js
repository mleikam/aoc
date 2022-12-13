const { inputToArray, readInput } = require('../readInput')
require('../polyfill')

const lines = inputToArray(readInput('./input.txt'))

const strip = [1]
const additions = [0]

const doTask = (cycle,instruction) => {
  const [task,value] = instruction.split(' ')
  if (task === 'break') return;
  if(task === 'noop'){
    additions.push(0);
  } else {
    const v = parseInt(value,10);
    additions.push(v);
    additions.push(0)
  }
}

const processAdditions = (cycle) => {
  const previous = cycle === 0 ? 1 : strip[cycle] 
  const x = previous + additions[cycle];
  strip.push(x)
}

let CRT = '';

const drawCRT  = cycle => {
  if( cycle > 0 && cycle % 40 === 0) CRT += "\n"
  const range = [
    strip[cycle]-1,
    strip[cycle],
    strip[cycle]+1
  ];
  const marker = (range.includes(cycle % 40)) ? '#':'.'
  CRT += marker;
}

let cycle = 0;
while(additions.length > cycle){
  // console.log('--'.repeat(20), cycle+1)
  const instruction = lines[cycle] ?? 'break'
  // console.log('At the start of the',cycle+1,' cycle, the',instruction,'begins execution');
  doTask(cycle,instruction)
  // console.log('During the',cycle+1,'cycle, X is', strip[cycle])
  drawCRT(cycle)
  processAdditions(cycle)
  // console.log('After the',cycle+1,'cycle, the',additions[cycle],'instruction finishes execution, setting X to', strip[cycle+1])
  cycle += 1; 
}

const getStrengthAtCycle = cycle => strip[cycle-1]*cycle;

const part1 = [20,60,100,140,180,220].map( getStrengthAtCycle ).sum();
console.log({part1})
console.log(CRT)
