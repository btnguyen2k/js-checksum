import {checksum} from '../src/index.js'

const hashAlgos = ['md5', 'sha1', 'sha256', 'sha512', 'dummy', null, undefined]
const optsList = []
for (const algo of hashAlgos) {
  if (algo === 'md5') {
    optsList.push({hash: algo, DEBUG: true})
  } else {
    optsList.push({hash: algo, DEBUG: false})
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

  test('numbers (int, float, bigint) must have same checksum', () => {
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

  test('function and string must have different checksums', () => {
    for (const opts of optsList) {
      const f = (name) => { return 'hello ' + name }
      const s = `${f}`
      expect(checksum(f, opts)).not.toEqual(checksum(s, opts))
    }
  })

  test('Symbol', () => {
    for (const opts of optsList) {
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol(1), opts))
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol(1.0), opts))
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol(1n), opts))
      expect(checksum(Symbol('1'), opts)).toEqual(checksum(Symbol('1'), opts))
      expect(checksum(Symbol(1), opts)).toEqual(checksum(Symbol('1'), opts))
      expect(checksum(Symbol('1.0'), opts)).not.toEqual(checksum(Symbol('1'), opts))
    }
  })

  test('Error', () => {
    for (const opts of optsList) {
      const e1 = new Error('error')
      const e2 = new Error('error-')
      const e3 = new Error('error')
      const e4 = e2
      expect(checksum(e2, opts)).toEqual(checksum(e4, opts))
      expect(checksum(e1, opts)).not.toEqual(checksum(e2, opts))
      expect(checksum(e1, opts)).not.toEqual(checksum(e3, opts))
      expect(checksum(e2, opts)).not.toEqual(checksum(e3, opts))
    }
  })

  test('Date', () => {
    for (const opts of optsList) {
      const d1 = new Date()
      d1.setDate(1)
      const d2 = d1
      const d3 = new Date()
      d3.setDate(3)
      expect(checksum(d1, opts)).toEqual(checksum(d2, opts))
      expect(checksum(d2, opts)).not.toEqual(checksum(d3, opts))
      expect(checksum(d1, opts)).not.toEqual(checksum(d3, opts))
    }
  })

  test('String', () => {
    for (const opts of optsList) {
      const s1 = 'hello'
      const s2 = String('hello')
      expect(checksum(s1, opts)).toEqual(checksum(s2, opts))
    }
  })

  test('RegExp', () => {
    for (const opts of optsList) {
      const r1 = /hello/
      const r2 = /hello/i
      /* eslint prefer-regex-literals: "off" */
      const r3 = new RegExp('hello')
      expect(checksum(r1, opts)).not.toEqual(checksum(r2, opts))
      expect(checksum(r1, opts)).toEqual(checksum(r3, opts))
      expect(checksum(r2, opts)).not.toEqual(checksum(r3, opts))
    }
  })

  test('Map', () => {
    for (const opts of optsList) {
      const m1 = new Map()
      m1.set({k: 'a'}, 1)
      m1.set({k: 'b'}, '2')
      m1.set({k: 'c'}, true)
      const m2 = new Map()
      m2.set({k: 'c'}, true)
      m2.set({k: 'a'}, 1.0)
      m2.set({k: 'b'}, '2')
      const m3 = new Map()
      m3.set({k: 'a'}, '1')
      m3.set({k: 'b'}, '2')
      m3.set({k: 'c'}, true)
      expect(checksum(m1, opts)).toEqual(checksum(m2, opts))
      expect(checksum(m1, opts)).not.toEqual(checksum(m3, opts))
      expect(checksum(m2, opts)).not.toEqual(checksum(m3, opts))

      const m4 = new Map()
      m4.set({k: 'a'}, 1)
      m4.set({k: 'b'}, '2')
      m4.set({k: 'd'}, true)
      expect(checksum(m1, opts)).not.toEqual(checksum(m4, opts))
      expect(checksum(m2, opts)).not.toEqual(checksum(m4, opts))
      expect(checksum(m3, opts)).not.toEqual(checksum(m4, opts))
    }
  })

  test('Map vs base Object', () => {
    for (const opts of optsList) {
      const m1 = new Map()
      m1.set('a', 1)
      m1.set('b', '2')
      m1.set('c', true)
      const m2 = {a: 1, b: '2', c: true}
      expect(checksum(m1, opts)).not.toEqual(checksum(m2, opts))
    }
  })

  test('Set', () => {
    for (const opts of optsList) {
      const s1 = new Set([1, '2', true])
      const s2 = new Set(['2', true, 1.0])
      const s3 = new Set([true, 1n, '2'])
      expect(checksum(s1, opts)).toEqual(checksum(s2, opts))
      expect(checksum(s1, opts)).toEqual(checksum(s3, opts))

      const s4 = new Set([1, '2', false])
      expect(checksum(s1, opts)).not.toEqual(checksum(s4, opts))
      expect(checksum(s2, opts)).not.toEqual(checksum(s4, opts))
      expect(checksum(s3, opts)).not.toEqual(checksum(s4, opts))
    }
  })

  test('WeakMap is not supported', () => {
    for (const opts of optsList) {
      const m1 = new WeakMap()
      m1.set({k: 'a'}, 1)
      const m2 = new WeakMap()
      m1.set({k: 'a'}, 2)
      expect(checksum(m1, opts)).toEqual(checksum(m2, opts))
    }
  })

  test('WeakSet is not supported', () => {
    for (const opts of optsList) {
      const s1 = new WeakSet([{k: 'a'}])
      const s2 = new WeakSet([{k: 'b'}])
      expect(checksum(s1, opts)).toEqual(checksum(s2, opts))
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

  test('cyclic ref - object', () => {
    for (const opts of optsList) {
      const root = {
        a: 1,
        b: '2',
        c: true,
      }
      const rootCyclic = {
        c: true,
        a: 1.0,
        b: '2',
      }
      rootCyclic.d = rootCyclic
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
      if (opts) {
        opts.disable_warning_cyclic = true
      }
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
    }
  })

  test('cyclic ref - array', () => {
    for (const opts of optsList) {
      const root = [1, '2', true]
      const rootCyclic = [1.0, '2', true]
      rootCyclic.push(rootCyclic)
      const rootCyclic2 = [1, '2']
      rootCyclic2.push(rootCyclic2)
      rootCyclic2.push(true)
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
      if (opts) {
        opts.disable_warning_cyclic = true
      }
      expect(checksum(root, opts)).not.toEqual(checksum(rootCyclic2, opts))
    }
  })

  test('cyclic ref - map', () => {
    for (const opts of optsList) {
      const root = new Map()
      root.set('a', 1)
      root.set('b', '2')
      root.set('c', true)
      const rootCyclic = new Map()
      rootCyclic.set('b', '2')
      rootCyclic.set('c', true)
      rootCyclic.set('a', 1.0)
      rootCyclic.set('d', rootCyclic)
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
      if (opts) {
        opts.disable_warning_cyclic = true
      }
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
    }
  })

  test('cyclic ref - set', () => {
    for (const opts of optsList) {
      const root = new Set([1, '2', true])
      const rootCyclic = new Set(['2', true, 1.0])
      rootCyclic.add(rootCyclic)
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
      if (opts) {
        opts.disable_warning_cyclic = true
      }
      expect(checksum(root, opts)).toEqual(checksum(rootCyclic, opts))
    }
  })

  test('no cyclic ref', () => {
    for (const opts of optsList) {
      const input1 = {
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        mangle: true,
        sanitize: false,
        safety: true,
        safety_opts: {add_tags: ['exec']},
        inline: false
      }
      const input2 = {
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        mangle: true,
        sanitize: false,
        safety: true,
        safety_opts: {add_attrs: ['myattr']},
        inline: false
      }
      expect(checksum(input1, opts)).not.toEqual(checksum(input2, opts))
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
