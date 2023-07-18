import {checksum} from '../../src/index.js'

const v1 = NaN
const v2 = null
console.log(v1, checksum(v1, {DEBUG: true}))
console.log(v2, checksum(v2, {DEBUG: true}))
