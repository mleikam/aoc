const { inputToArray, readInput } = require('../readInput')
require('../polyfill')

const lines = inputToArray(readInput('./input.txt'))

const rangeToSpan = range => range.split('-').map( n => parseInt(n,10))

const getSpans = ([first,second]) => {
  const a = rangeToSpan(first)
  const b = rangeToSpan(second)
  return [{ start: a[0], end: a[1]},{ start: b[0], end: b[1]}]
}

// part 1
// const hasOverlap = (a,b) => a.start <= b.start && a.end >= b.end;
// part 2
const hasOverlap = (a,b) => a.start <= b.start && a.end >= b.start;

let count = 0;

for(let i=0;i<lines.length;i++){
  const [first,second] = getSpans(lines[i].split(','))
  const a = hasOverlap(first,second)
  const b = hasOverlap(second,first)
  if(a || b ) count += 1;
}

console.log({ count })
