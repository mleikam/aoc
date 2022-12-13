const { readInput } = require('../readInput');
require('../polyfill')

const input = readInput("./input.txt")
const inputs = input.split(/Monkey [0-9]:/)

const TOTAL_ROUNDS = 10000;
const CALCULATE_VALUES = false; // set to true on part 1 to support worry reduction

// const echo = (...args) => console.log(...args)
const echo = () => null;

///////////////////////////////////////////////////////////////////

const divisors = Array.from(input.matchAll(/divisible by ([0-9]+)/g))
  .map(m => parseInt(m[1]))

const isFactorOf = (a,b) => a % b === 0;

///////////////////////////////////////////////////////////////////

const enforce = (n,d) => {
  const m = n % d;
  if(m===0) return d;
  return m;
}

const makeDivisors = (n) => divisors.reduce((acc,d) => { 
      acc[d] = enforce(n,d);
      return acc;
    },{})

const parseItemInput = s => {
  return s.split(", ").map( x => parseInt(x,10)).map( n => ({
    value: n,
    factors: makeDivisors(n)
  }))
}

const parseOperation = s => {
  const n = parseInt(s.match(/[0-9]+/),10);
  const op = {
    add: 0,
    multiply: 1,
    duplicate: false,
  }
  if(s.indexOf('old * old') > -1 ){ 
    return { ...op, duplicate: true }
  } else if( s.indexOf('+') > -1) {
    return { ...op, add: n }
  } else {
    return { ...op, multiply: n }
  }
  return op;
}


class Monkey{
  constructor(s,i){
    this.id = i
    this.count = 0; // how many times they have inspected an item
    this.items = parseItemInput(s.match(/Starting items: ([0-9, ]+)/)[1])
    this.operation = parseOperation(s.match(/Operation: ([\w0-9=+* ]+)/)[1]);//.replace('new','_new');
    this.test = parseInt(s.match(/divisible by ([0-9]+)/)[1],10);
    this.ifTrue = parseInt(s.match(/true: throw to monkey ([0-9]+)/)[1],10);
    this.ifFalse = parseInt(s.match(/false: throw to monkey ([0-9]+)/)[1],10);

    divisors.push(this.test)
  }
  applyOperation(item){
    const { ...newItem } = item;
    Object.entries(newItem.factors).map( ([key,value]) => {
      const factor = parseInt(key,10)
      let newValue = null;
      if(this.operation.duplicate){
        newValue = value*value;
      } else {
        newValue = (value + this.operation.add) * this.operation.multiply;
      }
      const v = enforce(newValue,factor);
      newItem.factors[key] = v
    })
    if(CALCULATE_VALUES){
      if(this.operation.duplicate){
        newItem.value = newItem.value * newItem.value;
      } else if(this.operation.multiply > 1) {
        newItem.value = newItem.value * this.operation.multiply;
      } else {
        newItem.value = newItem.value + this.operation.add;        
      }
      newItem.factors = makeDivisors(newItem.value)
    }
    return newItem;
  }
  isDivisible(item){
    const answer = (item.factors[this.test] === this.test)
    return answer;
  }
  throw(trueOrFalse,item){
    const recipient = trueOrFalse ? this.ifTrue : this.ifFalse;
    monkeys[recipient].catch(item);
    echo(this.id,'threw to',recipient,'with value', item.value)
    const firstItem = this.items.shift(); // remove it from your list
  }
  catch(item){
    this.items.push(item)
  }
  report(){
    console.group(`Monkey ${this.id}`);
    console.log('inspections',this.count)
    console.groupEnd();
  }

}
///////////////////////////////////////////////////////////////////

const reduceWorry = item => {
  const newItem = {...item}
  newItem.value = Math.floor(item.value/3)
  newItem.factors = makeDivisors(newItem.value)
  echo('reduced worry from ', item.value, newItem.value)
  return newItem;
}

const monkeys = inputs.slice(1).map( (s,i) => new Monkey(s,i) )

for(let round=1;round<=TOTAL_ROUNDS;round++){
  echo(round, "-".repeat(40))
  monkeys.forEach( monkey => {
    echo(`\nmonkey ${monkey.id}'s turn`, "-".repeat(40))
    const items = [...monkey.items]
    items.forEach( item => {
      echo(`\nmonkey ${monkey.id} inspected item`, item.value)
      monkey.count += 1;
      const inspectedItem = monkey.applyOperation(item);
      const relief = CALCULATE_VALUES ? reduceWorry(inspectedItem) : inspectedItem
      const testResult = monkey.isDivisible(relief);
      monkey.throw(testResult, relief)
    })
  })
}

console.log('After', TOTAL_ROUNDS,'rounds')
var _ = monkeys.forEach( m=> m.report())

const getMostActive = simians => {
  const counts = simians.map( m => m.count );
  const sorted = counts.sortNumeric();
  const topTwo = sorted.slice(0,2);
  const answer = topTwo.product()
  return answer; 
}

const monkeyBusiness = getMostActive(monkeys)
console.log({monkeyBusiness});
// 14393880638 is too high
// 12848882750
