import {checksum} from '../../src/index.js'

const s1 = Symbol(1)
const s2 = Symbol('1')
console.log(s1, s1.toString(), checksum(s1))
console.log(s2, s2.toString(), checksum(s2))
