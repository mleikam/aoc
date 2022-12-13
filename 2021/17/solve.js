const { readInput } = require('../readInput')
require('../polyfill')

let input = readInput('./input.txt');
// input = 'target area: x=20..30, y=-10..-5' 

const matches = input.matchAll(/([-0-9]+)..([-0-9]+)/g);
const target = []

for(match of matches){
	target.push([parseInt(match[1],10), parseInt(match[2],10)])
}

console.log(target)

const getNewPosition = (p,v) => [p[0]+v[0],p[1]+v[1]];

const getNewVelocity = (p,v) => {
	const dx = v[0] === 0 ? 0 : v[0] < 0 ? 1 : -1
	const dy = -1 
	return [v[0]+dx, v[1]+dy]
}

const targetMissed = position => {
	const [x,y] = position;
	const [tx,ty] = target;
	if(y < ty[0]) return true; // below the target zone
	if(x > tx[1]) return true; // right of the target zone
	return false;
}

const targetHit = position => {
	const [x,y] = position;
	const [tx,ty] = target;
	if(x >= tx[0] && x <= tx[1] && y >= ty[0] && y <= ty[1]) return true;
	return false;
}

const step = (velocity, position = [0,0], path = [], count = 0 ) => {
	path = path.concat([position])
	if( targetHit(position) ){
		return { hit: true, position, velocity, path, count }
	}
	if( targetMissed(position) ){
		return { hit: false, position, velocity, path, count }
	}
	if(count > 1000) return null;
	const pos = getNewPosition(position,velocity)
	const vel = getNewVelocity(position,velocity)
	return step(vel, pos, path, count+1)
}

const getMaxHeight = path => path.reduce( (top, coord) => coord[1] > top ? coord[1] : top, -Infinity)

let maxHeight = 0; // part 1
let counter = 0; // part 2
for(y=target[1][0]; y<=105; y++){
	for(x=1; x<=target[0][1]; x++){
		const result = step([x,y])
		if(result.hit){
			counter += 1;
			const { path } = result
			const height = getMaxHeight(path)
			maxHeight = height > maxHeight ? height : maxHeight;
		}
	}
}

console.log({ maxHeight, counter })
