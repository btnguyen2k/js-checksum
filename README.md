# @btnguyen2k/checksum

[![npm](https://badgen.net/npm/v/@btnguyen2k/checksum)](https://www.npmjs.com/package/@btnguyen2k/checksum)
[![Release](https://img.shields.io/github/release/btnguyen2k/js-checksum.svg?style=flat-square)](RELEASE-NOTES.md)
[![Actions Status](https://github.com/btnguyen2k/js-checksum/actions/workflows/all-branches.yaml/badge.svg)](https://github.com/btnguyen2k/js-checksum/actions)
[![codecov](https://codecov.io/gh/btnguyen2k/js-checksum/branch/main/graph/badge.svg)](https://codecov.io/gh/btnguyen2k/js-checksum)

🔧 Configurable hash functions: `md5`, `sha1`, `sha256` and `sha512`.

⭐ Supported data types:
- [Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
- Special values: `NaN`, `null`, `undefined` and `Infinity`
- Function
- Array
- Object
- [Built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects):
  - `Symbol`
  - `Error`
  - `Date`
  - `RegExp`
  - Arrays (include `IntxxxArray`, `FloatxxxArray`, `UintxxxArray`, `ArrayBuffer` and `DataView`)
  - `Map` (`WeakMap` is not supported!)
  - `Set` (`WeakSet` is not supported!)

💫 Support nested data structure of any supported type above.

**Checksum rules**

👉 `checksum(null|undefined)` returns empty string (`''`).

👉 numbers (int, float, bigint) have the same checksum: `checksum(1) === checksum(1.0) === checksum(1n)`.

👉 order of object properties do not affect checksum: `checksum({a: 1, b: 2}) === checksum({b: 2, a: 1})`.

👉 order of map entries do not affect checksum: `checksum(new Map([['a', 1], ['b', 2]])) === checksum(new Map([['b', 2], ['a', 1]]))`.

👉 order of set entries do not affect checksum: `checksum(new Set([1, 2])) === checksum(new Set([2, 1]))`.

👉 map and object with the same entries have the same checksum: `checksum(new Map([['a', 1], ['b', 2]])) === checksum({a: 1, b: 2})`.

👉 objects of different classes with the same entries have differnt checksums: `checksum(new Map([['a', 1], ['b', 2]])) !== checksum(new (class {a = 1; b = 2})())`.

## Installation

**with npm**

```shell
$ npm install -S @btnguyen2k/checksum
```

## Usage

```javascript
import {checksum} from '@btnguyen2k/checksum'

// use default hash function
console.log(checksum('a string'))

// specify a hash function
console.log(checksum([1, 'a string', true]))
```

## License

MIT - see [LICENSE.md](LICENSE.md).
