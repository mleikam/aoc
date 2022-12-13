const { readInput, inputToArray } = require('../readInput')
require('../polyfill')

const input = readInput('./input.txt')
// const input = readInput('./example.txt')

let maxX = 0, maxY = 0;

const data = new Set();
const instructions = [];
inputToArray(input).map( row => {
	if(row.substring(0,4) === 'fold'){
		const match = row.match(/(x|y)=([0-9]+)/)
		instructions.push( {raw: match, index: match[1] ==='x' ? 0 : 1, pivot: parseInt(match[2],10)} )
	} else {
		const match = row.match(/([0-9]+),([0-9]+)/)
		if(match){
			data.add(match[0])
			const x = parseInt(match[1],10); 
			const y = parseInt(match[2],10)
			if(x > maxX ) maxX = x;
			if(y > maxY ) maxY = y; 
		}
	}
})

const keyToCoord = key => key.split(',').map( i => parseInt(i,10))

const coordToKey = coord => coord.join(',')

const render = paper => {
	const map = new Map();
	paper.forEach( key => {
		map.set(key,keyToCoord(key));
	})
	let s = ''
	for(let y=0;y<=maxY;y++){
		for(let x=0;x<=maxX;x++){
			const key = coordToKey([x,y])
			s += map.has(key) ? '#' : '.'
		}
		s += "\n"
	}
	console.log(s)
}

const trimPaper = instruction => {
	if(instruction.index === 0) maxX = Math.floor(maxX/2) -1;
	if(instruction.index === 1) maxY = Math.floor(maxY/2) -1;
}

const splitSet = (instruction,paper) => {
	const from = new Set();
	const to = new Set();
	paper.forEach( key => {
		const coord = keyToCoord(key)
		const set = (coord[instruction.index] > instruction.pivot) ? from : to;
		set.add(coordToKey(coord))
	})
	return { from, to };
}

const makeReflector = (coord,pivot) => i => pivot - (coord[i] - pivot)

const translateData = ({from, to}, instruction) => {
	const paper = new Set(to);
	from.forEach( key => {
		const coord = keyToCoord(key)
		const reflect = makeReflector(coord,instruction.pivot)
		const x = (instruction.index === 0) ? reflect(0) : coord[0];
		const y = (instruction.index === 1) ? reflect(1) : coord[1]; 
		paper.add(coordToKey([x,y]))
	})
	return paper;
}

// const runbook = [instructions[0]]; // PART 1
const runbook = instructions;	// PART 2

const result = runbook.reduce( (paper, instruction) => {
	const newPaper = translateData(splitSet(instruction,paper), instruction)
	trimPaper(instruction)
	return newPaper;
}, data)

console.log({ dots: result.size })
render(result)
