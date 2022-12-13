const { readInput, inputToArray } = require('../readInput')

const input = readInput();
// const input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

// 22 13 17 11  0
//  8  2 23  4 24
// 21  9 14 16  7
//  6 10  3 18  5
//  1 12 20 15 19

//  3 15  0  2 22
//  9 18 13 17  5
// 19  8  7 25 23
// 20 11 10 24  4
// 14 21 16 12  6

// 14 21 17 24  4
// 10 16 15  9 19
// 18  8 23 26 20
// 22 11 13  6  5
//  2  0 12  3  7`;

const PLAYED = '__'
const DELIM_A = ';'
const DELIM_B = ' : '
const DELIM_C = 'x'; // not reg-ex significant

// extract guesses and boards
const x = input.replace("\n\n",DELIM_A).replaceAll("\n\n",DELIM_B).replaceAll("\n"," ")
const [a,b] = x.split(DELIM_A)
const guesses = a.split(',')
// transform board inputs into array of arrays
let boards = b.split(DELIM_B).map(board => board.replaceAll( new RegExp(/([\d]) /,'g'),'$1'+DELIM_C).split(DELIM_C))

const getWinningBoard = (board,makeCellRange) => {
	let boardWon = false
	Array(5).fill(null).forEach( (_,index) => {
		const cells = makeCellRange(board,index)
		if( cells.every( cell => cell === PLAYED) ){
			boardWon = true;
		}
	})
	return boardWon ? board : null;
}

const hasVeriticalWin = board => {
	const makeColumn = (board,index) => Array(5).fill(null).map( (_,i) => board[5*i+index])
	return getWinningBoard(board,makeColumn)
}

const hasHorizontalWin = board => {
	const makeRow = (board,index) => board.slice(5*index,5*index+5)
	return getWinningBoard(board,makeRow)
}

const bingo = board => hasHorizontalWin(board) || hasVeriticalWin(board)

const sumBoard = board => board.filter( cell => cell !== PLAYED)
	.map( cell => parseInt(cell,10) )
	.reduce( (total, value) => total + value)

const applyGuess = (board, guess) => {
	const paddedGuess = guess.padStart(2," ");
 	const foundIndex = board.indexOf(paddedGuess)
 	if(foundIndex > -1) board[foundIndex] = PLAYED;
 	return board;
}

// play all boards until completion
const boardsAsWon = []
boards.forEach((board,i) => {
	let lastGuess;
	for(iteration in guesses){
		lastGuess = guesses[iteration];
		board = applyGuess(board,lastGuess)
	 	if(bingo(board)){
			boardsAsWon.push({ board, lastGuess, iteration })
			break;
	 	}
	}
})

const report = data => {
	const winningSum = sumBoard(data.board)
	const score = winningSum*parseInt(data.lastGuess,10); 
	console.log('bingo!', {winningSum, guess: data.lastGuess, score})	
}

const sorted = boardsAsWon.sort( (a,b) => parseInt(a.iteration,10) >= parseInt(b.iteration,10) ? 1 : -1)

// part 1
report(sorted.shift())
// part 2
report(sorted.pop())
