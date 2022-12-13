const { readInput } = require('../readInput');
require('../polyfill')

const inputs = readInput("./example.txt").split(/Monkey [0-9]:/)

const TOTAL_ROUNDS = 20;

// const echo = (...args) => console.log(...args)
const echo = () => null;

let reduceWorry = item => {
  const v = makeWorry(item)
  const reduced = Math.floor(v/3);
  // console.log("reducedWorry from ", item.value, 'to',reduced)
  return {
    additions: 0,
    value: reduced,
    factors: [],
    multipliers: []
  }
}
// reduceWorry = worry => worry

// =================================================================

const divisors = []

const isFactorOf = (a,b) => a % b === 0;

const parseItemInput = s => {
  return s.split(", ").map( x => parseInt(x,10)).map( n => ({
    value: n,
    factors: [],
    additions: 0,
    multipliers: []
  }))
}

const parseOperation = s => {
  const output = {
    adds: 0,
    factors: [],
    duplicate: false
  }
  if(s.indexOf('old * old') > -1 ){ 
    output.duplicate = true;
  } else if( s.indexOf('+') > -1) {
    const n = parseInt(s.match(/[0-9]+/),10);
    output.adds = n;
  } else {
    const n = parseInt(s.match(/[0-9]+/),10);
    output.factors.push(n)
  }
  return output;
}

class Monkey{
  constructor(s,i){
    this.id = i
    this.activity = 0; // how many times they have inspected an item
    this.items = parseItemInput(s.match(/Starting items: ([0-9, ]+)/)[1])
    this.operation = parseOperation(s.match(/Operation: ([\w0-9=+* ]+)/)[1]);//.replace('new','_new');
    this.test = parseInt(s.match(/divisible by ([0-9]+)/)[1],10);
    this.ifTrue = parseInt(s.match(/true: throw to monkey ([0-9]+)/)[1],10);
    this.ifFalse = parseInt(s.match(/false: throw to monkey ([0-9]+)/)[1],10);

    divisors.push(this.test)

  }
  applyOperation(old){
    if(this.operation.duplicate){
      const newFactors = [...old.factors]
      let v = old.value;
      divisors.forEach( f => {
        if(isFactorOf(v,f)){
          newFactors.push(f)
          v = old.value/f;
        }
      })
      return {
        ...old,
        multipliers: old.multipliers.concat(old.value),
        factors: newFactors
      }
    }   

    const newItem = {
      ...old,
      additions: old.additions + this.operation.adds, 
      factors: old.factors.concat(this.operation.factors),
      multipliers: old.multipliers.concat(this.operation.factors)
    }
    return newItem
  }
  // returns boolean
  isDivisible(item){
    if( isFactorOf(item.value,this.test)) return true;
    if( item.factors.includes(this.test)) return true;
    if( item.additions > 0 && isFactorOf(item.additions,this.test)) return true;
    if( item.multipliers.reduce( (found,m) => {
      // if( isFactorOf(m,this.test) ) found = true;
      if( isFactorOf(m+item.additions,this.test) ) found = true;
      return found; 
    }, false)) return true;
    return false;
  }
  throw(trueOrFalse,item){
    const recipient = trueOrFalse ? this.ifTrue : this.ifFalse;
    monkeys[recipient].catch(item);
    echo(`Item with worry level ${makeWorry(item)} is thrown to monkey ${recipient}`);
    const firstItem = this.items.shift(); // remove it from your list
  }
  catch(item){
    this.items.push(item)
  }
  report(){
    console.group(`Monkey ${this.id}`);
    console.log('activity',this.activity)
    // console.log('items',this.items)
    // console.log('op', this.operation)
    console.groupEnd();
  }
}

const monkeys = inputs.slice(1).map( (s,i) => new Monkey(s,i) )

const makeWorry = item => {
  const hasFactors = item.multipliers.length > 0;
  const total = (item.additions + item.value ) * (hasFactors ? item.multipliers.product() : 1);
// console.log(item, total)
  return total;
}

const makeWorryOutput = (monkey,item, pre) => {
  const w = makeWorry(item)
  const a = 'Worry level is '
  if(monkey.operation.factors.length > 0){
    echo(`${a}multiplied by ${monkey.operation.factors.join('x')} to ${w}`)  
  } else if( monkey.operation.duplicate) {
    echo(`${a}is multiplied by ${makeWorry(pre)} to ${w}`)
  } else {
    echo(`${a}increased by ${monkey.operation.adds} to ${w}`) 
  }
} 

for(let round=1;round<=TOTAL_ROUNDS;round++){
echo(round, "-".repeat(40))
  monkeys.forEach( monkey => {
    const items = [...monkey.items]
    items.forEach( item => {
      echo('\nnew item! for monkey', monkey.id, item )
      echo(`Monkey inspects an item with a worry level of ${makeWorry(item)}`);
      monkey.activity += 1;
      const itemOnInspection = monkey.applyOperation(item);

// if(monkey.id === 4){
//   console.log({item, itemOnInspection, divisors})
// }
      makeWorryOutput(monkey,itemOnInspection,item)
      const relief = reduceWorry(itemOnInspection)
      echo(`Monkey gets bored with item. Worry level is divided by 3 to ${makeWorry(relief)}.`)
      const testResult = monkey.isDivisible(relief);
      echo(`Current worry level is${testResult ? '' : ' not'} divisible by ${monkey.test}`)
      monkey.throw(testResult, relief)
    })
  })
  // console.log(monkeys.map( monkey => [monkey.id, monkey.items]))
}


const getMostActive = simians => simians.map( m => m.activity ).sortNumeric().slice(0,2).product()
const monkeyBusiness = getMostActive(monkeys)
console.log('after', TOTAL_ROUNDS, 'rounds')
console.log(monkeys.forEach( m => m.report() ))
console.log({monkeyBusiness}); // part 1

// 14393880638 is too high
//  9330299412