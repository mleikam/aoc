const { readInput } = require('../readInput')
require('../polyfill')

const input = readInput();
// const input = readInput('./example.txt')
// const input = readInput('./example2.txt')
// const input = readInput('./example3.txt')

const lineWidth = input.split("\n")[0].trim().length;
const heights = Array(10).fill().map((_,i) => i.toString()).reverse(); // 9-0
const baseData = input.replaceAll(/[\n\r]+/g,'')
let data = baseData

const INVALID = null; 

const getNeighborIndexes = index => {
	// left
	const l = index-1
	const left = index % lineWidth === 0 ? INVALID : l	
	// right
	const r = index + 1;
	const right = r % lineWidth === 0 ? INVALID : r;
	// up
	const up = index >= lineWidth ? index-lineWidth : INVALID;
	// down 
	const down = index < data.length - lineWidth ? index+lineWidth : INVALID;
	return [up,down,left,right]
}
 
const getHeightForIndex = index => parseInt(baseData.charAt(index),10)

const indexIsValid = index => index !== INVALID

const hasLowerNeighbor = index => {
	const indexedHeight = getHeightForIndex(index);
	const validNeighbors = getNeighborIndexes(index).filter( indexIsValid )
	if(validNeighbors.length === 0) return false;
	const neighborHeights = validNeighbors.map( index => getHeightForIndex(index) )
	const hasLower = neighborHeights.some( h => h < indexedHeight)
	const neighborsAreSame = neighborHeights.every( h => h === indexedHeight )
	return hasLower || neighborsAreSame;
}

const lowIndexes = [];

heights.forEach( height => {
	let s = 0;
	while(true){
		const i = data.indexOf(height,s)
		if(i === -1) break;
		if( !hasLowerNeighbor(i) ){ lowIndexes.push(i) }
		s = i+1;
	}
})

const lowHeights = lowIndexes.map(getHeightForIndex)

const getRiskLevel = height => height + 1;

const riskSum = lowHeights.map(getRiskLevel).sum()
console.log({riskSum, count: lowHeights.length});

// part 2 
const seeds = [...lowIndexes]
const basins = []

const basinReducer = (b,i) => {
	buildBasinFrom(i,b).forEach(x => b.add(x))
	const pos = seeds.indexOf(i)
	if(pos > -1) seeds.splice(pos,1)
	return b;
}

const indexIsBoundary = index => getHeightForIndex(index) === 9

const neighborFilter = basin => i => indexIsValid(i) && !indexIsBoundary(i) && !basin.has(i);

const buildBasinFrom = (index,basin = new Set()) => {
	if(indexIsBoundary(index)) return basin; 
	basin.add(index)
	return getNeighborIndexes(index).filter(neighborFilter(basin)).reduce(basinReducer, basin);
}

const allBasinSizes = seeds.reduce( (all,seed) => [...all, buildBasinFrom(seed).size],[]).sortNumeric()
console.log({topThreeProduct: allBasinSizes.slice(0,3).product()})

