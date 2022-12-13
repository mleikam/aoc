const { readInput, inputToArray } = require('../readInput')
const { timers } = require('../utils')
require('../polyfill')

let input = readInput('./input.txt')
// input = readInput('./example.txt')

let PART = 2; 
PART = 1;

const grid = inputToArray(input)
	.map( row => row.split('')
	.map( val => ({ value: parseInt(val,10), min: Infinity, visited: false })
));

const colHeight = grid.length;
const rowLength = grid[0].length;

// expand grid / part 2
const newCell = (cell,n) => {
	const newCell = {...cell};
	const v = (cell.value + n)%9; 
	newCell.value = v === 0 ? 9 : v;
	return newCell;
}

if(PART === 2){
	grid.forEach( (row,rowIndex) => {
		// horizontal
		for(x=1;x<5;x++){
			const newCells = row.map( cell => newCell(cell,x))
			grid[rowIndex] = [...grid[rowIndex],...newCells]
		}
		// vertical
		for(y=1;y<5;y++){
			grid[rowIndex + y*colHeight] = grid[rowIndex].map( cell => newCell(cell,y))
		}
	})
}

const endPoint = [grid[0].length-1,grid.length-1]

const coordToObject = ([x,y]) => grid[x][y]

const valueAt = ([x,y]) => {
	if(x < 0 || y < 0) return null;
	if(x > endPoint[0] || y > endPoint[1] ) return null;
	return coordToObject([x,y]).value
}

const isVisited = coord => coordToObject(coord).visited

const getMoveOptions = ([x,y]) => {
	const up = [x,y+1]
	const left = [x-1,y]
	const right = [x+1,y]
	const down = [x,y-1]
	return [up,left,down,right]
		.filter( c => valueAt(c) !== null)
}

const update = (coord,source) => {
	const target = coordToObject(coord);
	const a = target.value + coordToObject(source).min;
	if(a < target.min){
		target.min = a;
		target.visited = false;
	}
}

const visit = coord => {
	getMoveOptions(coord).forEach( move => {
		update(move,coord)
		if( !isVisited(move) ){
			queue.push(move)
		}
	})
	coordToObject(coord).visited = true;
}

// main
const boardSize = colHeight * rowLength
console.log({ PART, boardSize })
const duration = timers.get('duration')
grid[0][0].min = 0; 
const queue = [[0,0]]
let counter = 0;
while(queue.length > 0){
	const a = queue.shift();
	if(!isVisited(a))
		visit(a)
	counter += 1; 
	if(counter % boardSize === 0) console.log('working...', queue.length)
}

duration.stop()
const shortest = coordToObject(endPoint).min
console.log({shortest, counter})
timers.report();

const render = (map) => {
	let s = '';
	map.forEach(row => {
		s += row.reduce( (acc,cell) => acc + cell.value,'')+"\n"
	})
	console.log(s)
}

// render(grid)