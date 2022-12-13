const { readInput, inputToArray } = require('../readInput')

const input = inputToArray(readInput());
// const input = inputToArray(`199
// 200
// 208
// 210
// 200
// 207
// 240
// 269
// 260
// 263`);

const getN = s => parseInt(s,10)

let increases = 0;
let lastWindowSum = undefined; 

for(i=0;i<input.length-2;i+=1){
	const windowSum = getN(input[i]) + getN(input[i+1]) + getN(input[i+2])
	increases += windowSum > lastWindowSum ? 1 : 0;
	lastWindowSum = windowSum
}
console.log({increases})