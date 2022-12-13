const { readInput } = require('../readInput')
const { makeNeighborIndexes, indexIsValid } = require('../utils')
require('../polyfill')

const input = readInput('./input.txt')
// const input = readInput('./example.txt')
// const input = readInput('./example2.txt')

const lineWidth = input.split("\n")[0].trim().length;
const baseData = input.replaceAll(/[\n\r]+/g,'')
let data = baseData

const getNeighborIndexes = makeNeighborIndexes(lineWidth, baseData.length, true)

const GENERATIONS = 100;
let flashes = 0

const render = (d) => {
	let x = ''
	const rows = baseData.length/lineWidth;
	for(i=0;i<rows;i++){
		const s = i*lineWidth
		const e = s+lineWidth
		const y = d.slice(s,e)
		x += y+"\n"
	}
	console.log(x)
}

const getValueAtIndex = (index,grid) => parseInt(grid.charAt(index),10)

const incrementValueAtIndex = (index,grid) => {
	const value = getValueAtIndex(index, grid);
	if(value === 0) return grid; 
	const next = value === 9 ? 0 : value+1
	const g = grid.splice(index,1,next)
	return g; 
}

const incrementNeighborsFor = (index, grid, ignored) => {
	flashes += 1; 
	const neighbors = getNeighborIndexes(index).filter(indexIsValid)
	let g = grid;
	neighbors.filter( i=> !ignored.has(i) ).filter( i => getValueAtIndex(i, g) > 0).forEach( i => {
		if( getValueAtIndex(i,g) > 0){
			g = incrementValueAtIndex(i,g)
			if( getValueAtIndex(i,g) === 0) {
				ignored.add(i)
				g = incrementNeighborsFor(i,g,ignored)
			}
		}
	})
	return g
}

console.log('start')
render(data)

const levels = Array(10).fill().map( (_,i) => i ).reverse();

const evolve = (grid) => {
	levels.forEach( n => {
		const next = n === 9 ? '.' : n+1
		grid = grid.replaceAll(n, next)
	})
	grid = grid.replaceAll('.', '0')
	const done = new Set();
  const re = new RegExp('0', "g");
	for (const match of grid.matchAll(re)) {
		done.add(match.index)
		grid = incrementNeighborsFor(match.index,grid,done)
	}
	return grid;
}

for(g=1; g<=GENERATIONS; g++){
	data = evolve(data)
	if(g < 10 || g % 10 === 0){
		console.log('generation',g,'output:')
		render(data)
	}	
}

console.log('final')
render(data)
console.log({flashes})

//////////////////////////////////
// part 2

let data2 = baseData;
let step = 1;
while(true){
	data2 = evolve(data2)
	if( data2.count('0') === baseData.length ) break;
	step +=1 ;
}
console.log('all flashed on',{step})
