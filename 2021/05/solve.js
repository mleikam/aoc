const { getInputGenerator } = require('../readInput')

const input = getInputGenerator('./input.txt')
// const input = getInputGenerator('./example.txt')

const IS_PART_2 = true; // part 1 or part 2

const parseInputLine = line => line.split(' -> ').map( stringCoords => stringCoords.split(',').map(coord => parseInt(coord)))

const expandCoordinateRange = line => {
	const coordinateRange = []
	const a = line[0]; const b = line[1];
	const diffx = b[0] - a[0];
	const diffy = b[1] - a[1];
	const xIncrement = diffx === 0 ? 0 : diffx > 0 ? 1 : -1;
	const yIncrement = diffy === 0 ? 0 : diffy > 0 ? 1 : -1;
	let lastX = a[0]
	let lastY = a[1]
	coordinateRange.push([lastX,lastY])
	while(true){
		lastX += xIncrement;
		lastY += yIncrement;
		coordinateRange.push([lastX,lastY])
		if(lastX === b[0] && lastY === b[1]) break;
	}
	return coordinateRange;
}

const lineIsHorizontal = line => line[0][0] === line[1][0];
const lineIsVeritical = line => line[0][1] === line[1][1];

const makeMapKey = coord => coord.join(',')

const updateMapCounts = (range,map) => {
	range.forEach( coord => {
		const key = makeMapKey(coord)
		if(!map.has(key)) map.set(key,0)
		map.set(key, map.get(key)+1)
	})
}

const countVentOverlapsGreaterThanOrEqualTo = (count, map) => {
	let counter = 0;
	const gen = map.values();
	let iter = gen.next();
	while(!iter.done){
		if(count <= iter.value){
			counter += 1;
		} 
		iter = gen.next();
	}
	return counter; 
}

const ventMap = new Map();

let iterator = input.next()
while(!iterator.done) {
	if(iterator.value.trim() === "") break;
	const line = parseInputLine(iterator.value);
	if( IS_PART_2 || (lineIsVeritical(line) || lineIsHorizontal(line))){
		const range = expandCoordinateRange(line)
		updateMapCounts(range,ventMap)
	}
  iterator = input.next()
}

const answer = countVentOverlapsGreaterThanOrEqualTo(2,ventMap)
console.log({answer})
console.log('done')
