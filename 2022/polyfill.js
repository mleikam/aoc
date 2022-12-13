// test whether an array is all numeric
const isNumeric = (arr) => arr.every((n) => typeof n === "number");

const throwIfNotNumeric = (arr) => {
  if (!isNumeric(arr)) {
    throw new Error("only sum numbers");
  }
};

///////////////////////////

// adds the items in an array
Array.prototype.sum = function () {
  throwIfNotNumeric(this);
  return this.reduce((total, n) => total + n);
};

// multiplies
Array.prototype.product = function(){
  throwIfNotNumeric(this);
  return this.reduce((total, n) => total * n);  
}

// returns the unique members of an array
Array.prototype.unique = function () {
  return Array.from(new Set(this));
};

// sorts a numeric array ascending
Array.prototype.sortNumeric = function(){
  throwIfNotNumeric(this);
  return this.sort( (a,b) => a > b ? -1 : 1)  
}

///////////////////////////

// converts an array of strings to an array of numbers
String.prototype.toNumericArray = function (delim = "") {
  const maybeNumbers = this.split(delim).map((s) => parseInt(s, 10));
  throwIfNotNumeric(maybeNumbers);
  return maybeNumbers;
};

// counts the number of occurrences of s in a string; returns number
String.prototype.count = function (s) {
  const that = this;
  let counter = 0;
  let start = 0;
  while(true){
    const index = that.indexOf(s,start)
    if(index === -1) break;
    counter += 1;
    start = (index+1); 
  }
  return counter;
};

// adds splice to strings; returns the updated string
String.prototype.splice = function(start,count,replace= undefined){
  const x = replace ?? ''
  return this.slice(0,start)+x+this.slice(start+count)
}

///////////////////////////
Map.prototype.sumValues = function () {
  return [...this.values()].sum(); // use array sum polyfill
};

///////////////////////////
module.exports = {};
