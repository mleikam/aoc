const { canVisitFilter } = require('./solve')

console.log('\ntests should all return true')

// add a second visit
filter = canVisitFilter({a: 1},['x','a','b'])
result = filter('a')
console.log(result)

// add a third visit
filter = canVisitFilter({a: 2},['x','a','b','a','c'])
result = filter('a')
console.log(!result)

// add a unique when the quota is met
filter = canVisitFilter({a: 2},['x','a','b','a','c'])
result = filter('d')
console.log(result)

// add a second when the quota is met
filter = canVisitFilter({a: 2},['x','a','b','a','c'])
result = filter('b')
console.log(!result)

// add a third uppercase cave
filter = canVisitFilter({a: 2},['x','a','X','a','X','c'])
result = filter('X')
console.log(result)

// add a third lowercase when there are two upper/two lowers
filter = canVisitFilter({a: 2},['x','a','X','a','X','c'])
result = filter('a')
console.log(!result)

// add a third lowercase when there are two upper/two lowers
filter = canVisitFilter({a: 2},'start,dc,kj,dc'.split(','))
result = filter('kj')
console.log(!result)
