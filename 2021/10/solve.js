const { readInput, inputToArray } = require('../readInput')
require('../polyfill')

const input = readInput();
// const input = readInput('example.txt')
const data = input.replaceAll('[','a').replaceAll(']','A')
	.replaceAll('<','b').replaceAll('>','B')
	.replaceAll('(','c').replaceAll(')','C')
	.replaceAll('{','d').replaceAll('}','D');

const rows = inputToArray(data);

// ): 3 points.
// ]: 57 points.
// }: 1197 points.
// >: 25137 points.
const pointsMap = new Map([['A',57], ['B',25137], ['C', 3], ['D', 1197]])

const getPoints = alpha => pointsMap.get(alpha)

let points = 0; 
const incompleteLines = []

for(let i=0;i<rows.length;i++){
	let row = rows[i];
	while(true){
		let misses = 0;
		['a','b','c','d'].forEach( x => {
			const index = row.indexOf(`${x}${x.toUpperCase()}`);
			if(index > -1 ) {
				row = row.splice(index,2,'');
			} else {
				misses +=1;
			}
		});
		if(misses >= 4) break; 
	}
	const firstIllegal = row.match(/[ABCD]/)
	if(firstIllegal === null){
		incompleteLines.push(row)
		continue;
	}
	points += getPoints(firstIllegal[0])
}

console.log({points}); // part 1

// part 2

// ): 1 point.
// ]: 2 points.
// }: 3 points.
// >: 4 points.
const solveMap = new Map([['A',2], ['B',4], ['C', 1], ['D', 3]])

const scoreCompletion = a => a.reduce( (total, letter) => total *5 + solveMap.get(letter),0)

const scores = []
incompleteLines.forEach( line => {
	const completion = line.split('').reverse().map(letter => letter.toUpperCase())
	const score = scoreCompletion(completion)
	scores.push(score)
})

const sortedScores = scores.sortNumeric();
const middleIndex = Math.floor(sortedScores.length/2);
const middleScore = sortedScores[middleIndex]
console.log({middleScore})