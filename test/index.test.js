import {checksum} from '../src/index.js'

const hashAlgos = ['md5', 'sha1', 'sha256', 'sha512', 'dummy', null, undefined]
const optsList = []
for (const algo of hashAlgos) {
  if (algo === 'md5') {
    optsList.push({hash: algo, DEBUG: true})
  } else {
    optsList.push({hash: algo})
  }
}
optsList.push(null, undefined, '')

describe('checksum', () => {
  beforeEach(() => {
    // Reset options before each test.
  })

  afterEach(() => {
    // Reset options after each test.
  })

  test('undefined should return empty string', () => {
    for (const opts of optsList) {
      expect(checksum(undefined, opts)).toEqual('')
    }
  })

  test('null should return empty string', () => {
    for (const opts of optsList) {
      expect(checksum(null, opts)).toEqual('')
    }
  })

  test('boolean must have different checksum from number', () => {
    for (const opts of optsList) {
      expect(checksum(true, opts)).not.toEqual(checksum(1, opts))
    }
  })

  test('boolean must have different checksum from string', () => {
    for (const opts of optsList) {
      expect(checksum(true, opts)).not.toEqual(checksum('true', opts))
    }
  })

  test('numbers (int, float, bigint) should have same checksum', () => {
    for (const opts of optsList) {
      expect(checksum(1, opts)).toEqual(checksum(1.0, opts))
      expect(checksum(1, opts)).toEqual(checksum(1n, opts))
      expect(checksum(1.0, opts)).toEqual(checksum(1n, opts))

      expect(checksum(1, opts)).not.toEqual(checksum(1.1, opts))
      expect(checksum(1.0, opts)).not.toEqual(checksum(1.1, opts))
    }
  })

  test('NaN and Infinity are different', () => {
    for (const opts of optsList) {
      const v1 = NaN
      const v2 = Infinity
      const v3 = -Infinity
      expect(checksum(v1, opts)).not.toEqual(checksum(v2, opts))
      expect(checksum(v1, opts)).not.toEqual(checksum(v3, opts))
      expect(checksum(v2, opts)).not.toEqual(checksum(v3, opts))
    }
  })

  test('number and string must have different checksums', () => {
    for (const opts of optsList) {
      expect(checksum(1, opts)).not.toEqual(checksum('1', opts))
    }
  })

  test('checksum of symbols is based on description', () => {
    for (const opts of optsList) {
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol(1), opts))
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol(1.0), opts))
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol(1n), opts))
      expect(checksum(Symbol('1'), opts)).toEqual(checksum(Symbol('1'), opts))
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol('1'), opts))
      expect(checksum(Symbol('1.0'), opts)).not.toEqual(checksum(Symbol('1'), opts))
    }
  })

  test('function and string must have different checksums', () => {
    for (const opts of optsList) {
      const f = (name) => { return 'hello ' + name }
      const s = `${f}`
      expect(checksum(f, opts)).not.toEqual(checksum(s, opts))
    }
  })

  test('array', () => {
    for (const opts of optsList) {
      const a1 = [1, 1.0, true, null]
      const a2 = [1.0, 1, true, undefined]
      const a3 = [1.0, '1', true, undefined]
      expect(checksum(a1, opts)).toEqual(checksum(a2, opts))
      expect(checksum(a1, opts)).not.toEqual(checksum(a3, opts))
      expect(checksum(a2, opts)).not.toEqual(checksum(a3, opts))
    }
  })

  test('object checksum must not be affected by order of keys', () => {
    for (const opts of optsList) {
      const o1 = {a: 1, b: '2', c: true}
      const o2 = {b: '2', c: true, a: 1.0}
      const o3 = {c: true, a: '1', b: '2'}
      expect(checksum(o1, opts)).toEqual(checksum(o2, opts))
      expect(checksum(o1, opts)).not.toEqual(checksum(o3, opts))
      expect(checksum(o2, opts)).not.toEqual(checksum(o3, opts))
    }
  })

  class Base {
    constructor(a, b, c) {
      this.a = a
      this.b = b
      this.c = c
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
  }

  test('same named class', () => {
    for (const opts of optsList) {
      const o1 = new Base(1, '2', true)
      const o2 = new Base(1.0, '2', true)
      const o3 = new Base('1', '2', true)
      expect(checksum(o1, opts)).toEqual(checksum(o2, opts))
      expect(checksum(o1, opts)).not.toEqual(checksum(o3, opts))
      expect(checksum(o2, opts)).not.toEqual(checksum(o3, opts))
    }
  })

  test('different classes with same properties', () => {
    for (const opts of optsList) {
      const o1 = new Base(1, '2', true)
      const o2 = {a: 1, b: '2', c: true}
      expect(checksum(o1, opts)).not.toEqual(checksum(o2, opts))
    }
  })

  test('child classes', () => {
    for (const opts of optsList) {
      const o1 = new Child(1, '2', true, true)
      const o2 = new Child(1, '2', true, false)
      expect(checksum(o1, opts)).not.toEqual(checksum(o2, opts))
    }
  })
})
