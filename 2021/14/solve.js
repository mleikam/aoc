const { readInput, inputToArray } = require('../readInput')
require('../polyfill')

let input = readInput('./input.txt')
// input = readInput('./example.txt')

let STEPS = 10; // part 1
// STEPS = 40; // part 2
// STEPS = 1; // 

const rows = inputToArray(input);
const template = rows.shift();
const _ = rows.shift();

const characterCount = new Map();

const rules = rows.reduce((map,row) => {
	const [pattern,insertion] = row.split(' -> ')
	map[pattern] = insertion
	characterCount.set(insertion,0)
	return map;
},{})

const incrementCount = (letter,n=1) => {
	const prev = characterCount.get(letter);
	characterCount.set(letter, prev+n)	
}

const start = performance.now();

const zero = Object.keys(rules).reduce( (map,key) => { map[key] = 0; return map }, {})

const createNextGeneration = current => {
	const next = {...zero};
	Object.entries(current).forEach( ([key,value]) => {
		const letter = rules[key];
		incrementCount(letter,value)
		const [x,y] = key.split('')
		next[`${x}${letter}`] += value;
		next[`${letter}${y}`] += value;
	})
	return next;
}

const score = countMap => {
	let least = Infinity;
	let most = 0;
	const values = countMap.values()
	for(count of values){
		if(count > most) most = count;
		if(count < least) least = count;
	}
	return most - least; 
}

let polymer = {}

for(let i=0;i<template.length;i++){ 
	incrementCount(template[i],1)
	if(i < template.length-1){
		const pair = template.slice(i,i+2)
		if(!polymer[pair]) polymer[pair] = 0;
		polymer[pair] += 1;
	}
}

for(let step=0; step<STEPS; step ++){
	polymer = createNextGeneration(polymer)
}

console.log('after',STEPS,'steps', template)
const score1 = score(characterCount)
console.log('score',score1)

console.log('duration', performance.now() - start)
