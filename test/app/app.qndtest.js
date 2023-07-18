import {checksum} from '../../src/index.js'

class Base {
  constructor(a, b, c) {
    this.a = a
    this.b = b
    this.c = c
  }

  x() {
    return 'x'
  }
}

class Child extends Base {
  c

  constructor(a, b, c, createOwn) {
    super(a, b, c)
    if (createOwn) {
      this.c = c
    }
  }

  x() {
    return 'xx'
  }

  y() {
    return 'y'
  }
}

const o1 = new Set(1, 2, 3, 4)
const o1 = new Set(1, 2, 3, 4)
const o2 = new Child(1, '2', true, false)

console.log(o1, checksum(o1))
for (const k of Object.keys(o1)) {
  console.log(k, o1[k])
}

console.log(o2, checksum(o2))
for (const k of Object.keys(o2)) {
  console.log(k, o2[k])
}
