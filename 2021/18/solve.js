const { readInput,inputToArray } = require('../readInput')
require('../polyfill')
const { timers } = require('../utils')

let input = readInput('./input.txt');
// input = readInput('example.txt')

const getMagnitude = (s) => {
	const [a,b] = eval(s);
	const m = Array.isArray(a) ? getMagnitude(a) : a;
	const n = Array.isArray(b) ? getMagnitude(b) : b;
	const magnitude = m*3 + n*2;
	return magnitude;
}

const addNumbers = (a,b) => `[${a},${b}]`

const splitNumber = s => {
	const timer = timers.get('splits');
	const n = parseInt(s,10)
	const a = Math.floor(n/2)
	const b = Math.ceil(n/2)
	timer.stop();
	return `[${a},${b}]`
}

const findLargeNumber = (s,greaterThan = 10) => {
	const timer = timers.get('larger');
	const re = /[0-9][0-9]+/g
	const matches = s.matchAll(re);
	for(match of matches){
		if( parseInt(match[0],10) >= greaterThan ) {
			return match;
		}
	}
	timer.stop();
	return null; 
}

const replaceNumber = (match,s) => {
	if(!match) return s;
	const replacement = splitNumber(match[0])
	const start = match.index;
	const count = match[0].length;
	return s.splice(start,count,replacement)
}

let counts = 0;
let countDuration = 0

const findNestedPair = s => {
	const timer = timers.get('nested pairs');
	const t = s.replaceAll('[','a').replaceAll(']','z')
	let nestedPair = null; 
	let nestedIndex = -1;
	let start = 0;
	while(nestedIndex === -1){
		if(start > t.length) break;
		const tt = t.slice(start)
		const pair = tt.match(/a([0-9]+),([0-9]+)z/)
		if(!pair) break;
		const substring = t.slice(0,start+pair.index);
		const openings = substring.count('a');
		const closings = substring.count('z');
		if(openings - closings === 4){
			nestedPair = pair
			nestedIndex = pair.index + start
			break;
		}
		start += pair.index + pair[0].length;
	}
	timer.stop()
	return [nestedIndex,nestedPair]
}

const explodeNumber = (pair,s) => {
	const [index,match] = pair;
	if(!match) return s;
	const timer = timers.get('explosion');
	const nextIndex = index+match[0].length;
	const nextNumber = s.slice(nextIndex).match(/[0-9]+/)
	const prevNumber = s.slice(0,index).match(/([0-9]+)[^0-9]*$/)
	// add to the next number
	if(nextNumber){
		const n = parseInt(nextNumber[0],10) + parseInt(match[2],10)
		const a = s.slice(0,nextIndex+nextNumber.index);
		const b = n.toString();
		const c = s.slice(nextIndex+nextNumber.index+nextNumber[0].length)
		s = [a,b,c].join('')
	}
	// replace pair with zero
	s = s.slice(0,index) + '0' + s.slice(index+match[0].length)
	// add to the previous number
	if(prevNumber){
		const n = parseInt(prevNumber[0],10) + parseInt(match[1],10)
		const a = s.slice(0,prevNumber.index);
		const b = n.toString();
		const c = s.slice(prevNumber.index + prevNumber[1].length)
		s = [a,b,c].join('')
	}
	timer.stop();
	return s; 
}

const reduceNumber = s => {
	const nested = findNestedPair(s)
	if(nested[1] !== null){
		return explodeNumber(nested,s)
	} else {
		const large = findLargeNumber(s,10)
		if(large){
			return replaceNumber(large,s)
		}
	}
	return null;
}

const sumNumbers = (a,b) => {
	const added = addNumbers(a,b)
	let reducing = true;
	let reduced = added;
	while(reducing){
		const output = reduceNumber(reduced)
		if(!output) break;
		reduced = output;
	}
	return reduced;
}

const main = (data) => {
	const nums = inputToArray(data);
	let sum = nums.shift();
	while(nums.length > 0){
		next = nums.shift();
		sum = sumNumbers(sum,next)
	}
	return sum;
}

const duration = timers.get('total duration')
const magnitude = getMagnitude(main(input))

console.log({ magnitude, same: magnitude===4173 }); // part 1
duration.stop();
timers.report()
timers.clear();


const part2 = timers.get('total duration')
let greatest = 0;
const data = inputToArray(input);
for(d of data){
	for(x of data){
		if(x !== d){
			const mag = getMagnitude(main(`${d}\n${x}`))
			greatest = mag > greatest ? mag : greatest;
		}
	}
}

console.log({greatest}) // part 2
part2.stop();
timers.report()

module.exports = {
	getMagnitude,
	findLargeNumber, 
	replaceNumber,
	explodeNumber,
	findNestedPair,
	main
}