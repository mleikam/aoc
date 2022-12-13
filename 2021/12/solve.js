const { readInput, inputToArray } = require('../readInput')
require('../polyfill')

const input = readInput('./input.txt')
// const input = readInput('./example.txt')
// const input = readInput('./example2.txt')
// const input = readInput('./example3.txt')

const END = 'end'
const START = 'start'

const IS_PART_2 = true

const isLowercase = s => s === s.toLowerCase();

const rows = inputToArray(input);
const data = rows.map(row => row.split('-')).reduce( (map,pair) => {
	const [a,b] = pair;
	if(!map[a]) map[a] = [];
	if(!map[b]) map[b] = [];
	if(b !== START){
		map[a].push(b);
	}
	if(b !== END && a !== START){
		map[b].push(a);
	}
	return map
},{});

const deepCopy = obj => Object.keys(obj).reduce( (copy, key) => { 
		copy[key] = obj[key]; 
		return copy
	},{})

const addToVisited = (cave,visited) => {
	if(!visited[cave]) visited[cave] = 0;
	visited[cave] += 1;
}

const countMultiples = (visited) => Object.values(visited).filter( count => count > 1).length;

const getElementCount = (visited, cave) => Object.keys(visited).join(',').count(cave);

const canAddCave = (path, visited, cave) => {
	if(!isLowercase(cave)) return true;
	if(countMultiples(visited) > 0 && getElementCount(visited,cave) > 0) return false;
	return true;
}

const canVisitFilterPart1 = (visited, path) => element => !Object.keys(visited).includes(element);

const canVisitFilterPart2 = (visited, path) => element => {
	if(!isLowercase(element)) return true; 
	const multiples = countMultiples(visited);
	if(multiples === 0){
		return true;
	}
	if( multiples === 1){
		return path.indexOf(element) === -1; 
	}
	return !Object.keys(visited).includes(element)
};

let counter = 0;

const walk = (path, cave, visited = {}) => {
	const canAdd = canAddCave(path,visited,cave);
	if(!canAdd) return;
	path.push(cave);
	if(cave === END){
		counter += 1; 
		return;
	}
	const canVisit = IS_PART_2 ? canVisitFilterPart2 : canVisitFilterPart1;
	const options = data[cave].filter(canVisit(visited, path));
	if(options.length === 0) return;
	if(isLowercase(cave)){
		addToVisited(cave,visited);
	}
	for(next of options){
		walk([...path], next, deepCopy(visited));
	}
}

let start = performance.now();
data.start.forEach(option => walk(['start'],option));

console.log({part2: IS_PART_2, counter});
console.log('duration', performance.now() - start);

module.exports = {
	canVisitFilter : canVisitFilterPart1
}
