
const { readInput, inputToArray } = require('../readInput')

const input = inputToArray(readInput()); // 775304
// const input = inputToArray(`
// 00100
// 11110
// 10110
// 10111
// 10101
// 01111
// 00111
// 11100
// 10000
// 11001
// 00010
// 01010
// `); // 198

const createBitCounts = (lines) => {
	const counts = []
	lines.forEach( line => {
		line.split('').forEach( (bitString,bitIndex) => {
			const index = parseInt(bitString,10);
			if( !Array.isArray(counts[bitIndex]) ){
				counts[bitIndex] = [0,0]
			}
			counts[bitIndex][index] += 1;
		})
	})
	return counts;
}

/////////////////////////////////// part 1

const bitCounts = createBitCounts(input)

const getGammaRate = (bits) => bits.map( counts => counts[0] > counts[1] ? '0' : '1').join('')
const getEpsilonRate = (bits) => bits.map( counts => counts[0] > counts[1] ? '1' : '0').join('')

const gamma = parseInt(getGammaRate(bitCounts),2);
const epsilon = parseInt(getEpsilonRate(bitCounts),2);
const powerConsumption = gamma*epsilon

console.log({gamma, epsilon, powerConsumption})

///////////////////////// part 2

// return string
// greater than comparison biases in favor of 1 in the most case/0 in the least case
const getMostCommonBitAtIndex = (bitIndex, counts) => counts[bitIndex][0] > counts[bitIndex][1] ? '0' : '1'
const getLeastCommonBitAtIndex = (bitIndex, counts) => counts[bitIndex][0] > counts[bitIndex][1] ? '1' : '0'
  
const filterByBitIndex = (lines, bitIndex, getBit) => {
	const counts = createBitCounts(lines)
	const match = getBit(bitIndex,counts)
	const candidates = lines.filter( line => line.split('')[bitIndex] === match)
	if(candidates.length === 1) return candidates[0]
	return filterByBitIndex(candidates,bitIndex+1,getBit)
}

const o2Filter = filterByBitIndex(input,0,getMostCommonBitAtIndex)
const co2Filter = filterByBitIndex(input,0,getLeastCommonBitAtIndex)
const lifeSupportRating = parseInt(o2Filter,2)*parseInt(co2Filter,2)

console.log({o2Filter , co2Filter, lifeSupportRating})
