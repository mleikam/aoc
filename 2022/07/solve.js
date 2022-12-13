const { inputToArray, readInput } = require('../readInput')
require('../polyfill')

const lines = inputToArray(readInput('./input.txt'))
// const lines = inputToArray(readInput('./example.txt'))

const DELIMITER = '/'
const ROOT_DIR = '/'

const isCdRoot = ([a,b,c]) => a === '$' && b === 'cd' && c === ROOT_DIR
const isCdX = ([a,b,c]) => a === '$' && b === 'cd' && !['..',ROOT_DIR].includes(c)
const isCdUp = ([a,b,c]) => a === '$' && b === 'cd' && c === '..'
const isLs = ([a,b]) => a === '$' && b === 'ls'
const isDir = ([a,b]) => a === 'dir' && /[a-z.]+/.test(b)
const isFile = ([a,b]) => !isNaN(parseInt(a,10)) && /[a-z.]+/.test(b)

const getSize = ([a]) => parseInt(a,10);


class Directory {
  constructor(path){
    this.path = path;
    this.size = 0;
    this.children = []
  }
  add(n){
    this.size += n
  }
  getTreeSize(){
    if(this.children.length === 0) return this.size;
    return this.size + this.children.map( dir => fileSystem[dir].getTreeSize() ).sum();
  }
}

const fileSystem = {
  [ROOT_DIR]: new Directory(ROOT_DIR)
}
let currentPath;
let ls = false;

const makeFsKey = (path) => `${currentPath}${path}${DELIMITER}`

const getParent = (path) => path.split(DELIMITER).slice(0,-2).join(DELIMITER)+DELIMITER;

for(const line of lines){
  const parts = line.split(' ');
  if(isCdRoot(parts)){
    ls = false;
    currentPath = ROOT_DIR
  }
  if(isCdUp(parts)){
    ls = false;
    currentPath = getParent(currentPath);
  }
  if(isCdX(parts)){
    ls = false;
    currentPath = makeFsKey(parts[2]);
  }
  if(ls && isFile(parts)){
    fileSystem[currentPath].add(getSize(parts))
  }
  if(ls && isDir(parts)){
    const key = makeFsKey(parts[1]);
    fileSystem[currentPath].children.push(key)
    if(!fileSystem[key]) fileSystem[key] = new Directory(key)    
  }
  if(isLs(parts)){ // last in the loop
    ls = true;
  }
}
console.log('abac'.splice(1,1,'x'))

// console.log(fileSystem)

// part 1
const maxSize = 100000;
let total = 0;
Object.entries(fileSystem).forEach( ([dir, obj]) => {
  const size = obj.getTreeSize();
  if(size <= maxSize) {
    total += size;
  }
})

console.log({total})

// part 2
const DISK_SIZE = 70000000;
const SPACE_NEEDED = 30000000;
const spaceUsed = fileSystem[ROOT_DIR].getTreeSize();
const FREE_SPACE = DISK_SIZE - spaceUsed;
const required = SPACE_NEEDED - FREE_SPACE;

let targets = [];
Object.values(fileSystem).forEach( dir => {
  const size = dir.getTreeSize();
  if(size >= required) {
    targets.push(size)
  }
})
const sorted = targets.sortNumeric().reverse();
console.log({ required, delete: sorted[0] })

