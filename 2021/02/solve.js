
const { readInput, inputToArray } = require('../readInput')

const input = inputToArray(readInput());
// const input = inputToArray(`
// forward 5
// down 5
// forward 8
// up 3
// down 8
// forward 2`)

let aim = 0;
let horizontal = 0;
let depth = 0;

input.forEach( line => {
	const [direction,unit] = line.split(' ')
	const value = parseInt(unit,10)
	switch(direction){
		case 'forward': 
			horizontal += value
			depth += aim*value
			break;
		case 'down':
			aim += value;
			break;
		case 'up':
			aim -= value;
			break;
	}
})
console.log({horizontal, depth, answer: horizontal*depth})