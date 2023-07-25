# @btnguyen2k/checksum release notes

## 2023-07-25 - v0.1.1

- Fix cyclic references.

## 2023-07-19 - v0.1.0

- Support hash functions `md5`, `sha1`, `sha256` and `sha512`.
- Support data types:
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
- Support nested data structure of any supported type above.
