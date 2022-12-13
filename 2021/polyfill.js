const isNumeric = (arr) => arr.every((n) => typeof n === "number");

const throwIfNotNumeric = (arr) => {
  if (!isNumeric(arr)) {
    throw new Error("only sum numbers");
  }
};

///////////////////////////

Array.prototype.sum = function () {
  throwIfNotNumeric(this);
  return this.reduce((total, n) => total + n);
};

Array.prototype.product = function(){
  throwIfNotNumeric(this);
  return this.reduce((total, n) => total * n);  
}

Array.prototype.unique = function () {
  return Array.from(new Set(this));
};

Array.prototype.sortNumeric = function(){
  throwIfNotNumeric(this);
  return this.sort( (a,b) => a > b ? -1 : 1)  
}

///////////////////////////
String.prototype.toNumericArray = function (delim = "") {
  return this.split(delim).map((s) => parseInt(s, 10));
};

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

String.prototype.splice = function(start,count,replace){
  return this.slice(0,start)+replace+this.slice(start+count)
}

///////////////////////////
Map.prototype.sumValues = function () {
  return [...this.values()].sum(); // use array sum polyfill
};

///////////////////////////
module.exports = {};
