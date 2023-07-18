import {checksum} from '../../src/index.js'

console.log(checksum(new Map([['a', 1], ['b', 2]])))

console.log(checksum(new (class {a = 1; b = 2})))
