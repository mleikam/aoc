const INVALID = null; 

const makeNeighborIndexes = (lineWidth,totalSize,includeDiagonals = false) => index => {
	// left
	const l = index-1
	const left = index % lineWidth === 0 ? INVALID : l	
	// right
	const r = index + 1;
	const right = r % lineWidth === 0 ? INVALID : r;
	// up
	const up = index >= lineWidth ? index-lineWidth : INVALID;
	// down 
	const down = index < totalSize - lineWidth ? index+lineWidth : INVALID;
	let neighbors = [up,down,left,right]
	if(includeDiagonals){
		const ul = v(up) && v(left) ? up - 1 : INVALID;
		const ur = v(up) && v(right) ? up + 1 : INVALID;
		const dl = v(down) && v(left) ? down - 1 : INVALID;
		const dr = v(down) && v(right) ? down + 1 : INVALID;

		neighbors = neighbors.concat([ul,ur,dl,dr]);
	}
	return neighbors
}

const indexIsValid = index => index !== INVALID
const v = indexIsValid; // private alias

const mod1 = (a,m) => {
	const b = a % m;
	return (b === 0) ? m : b;
}

const TimerSack = {}

const timers = {
	get: (key) => {
		if(!TimerSack[key]){
			TimerSack[key] = {
				key,
				count: 0,
				init: performance.now(),
				start: undefined,
				end: undefined,
				duration: 0,
				average: undefined,
				stop: () => {
					const now = performance.now();
					TimerSack[key].duration += now - TimerSack[key].start;
					TimerSack[key].end = now;
					TimerSack[key].average = TimerSack[key].duration/TimerSack[key].count;
				}
			}
		}
		TimerSack[key].start = performance.now();
		TimerSack[key].count += 1
		return TimerSack[key];
	},
	report: () => {
		console.log("\n")
		Object.entries(TimerSack).forEach( ([key,timer] ) => {
			console.info("\x1b[36m"+key+"\033[0m")
			Object
				.entries(timer)
				.filter(([k,t]) => {
					const excludedKeys = ['start','init','end']
					return typeof t === 'number' && !excludedKeys.includes(k)
				})
				.forEach(([k,v]) => {
					const n = ['count'].includes(k) ? v.toString() : v.toFixed(4);
					const value = n.padStart(10,". ")
					const label = k.padEnd(9," .")
					console.log("\t",label,value)
				})
		})
	},
	clear: () => {
		Object.keys(TimerSack).forEach(k => {
			TimerSack[k] = undefined;
			delete TimerSack[k]
		})
	}
}

module.exports = {
	INVALID, makeNeighborIndexes, indexIsValid,
	timers,
	mod1
}