import md5 from 'crypto-js/md5.js'
import sha1 from 'crypto-js/sha1.js'
import sha256 from 'crypto-js/sha256.js'
import sha512 from 'crypto-js/sha512.js'

const md5Hash = (value) => md5(value).toString().toLowerCase()
const sha1Hash = (value) => sha1(value).toString().toLowerCase()
const sha256Hash = (value) => sha256(value).toString().toLowerCase()
const sha512Hash = (value) => sha512(value).toString().toLowerCase()

const prefixBoolean = '\x10'
const prefixNumber = '\x11'
const prefixSymbol = '\x12'
const prefixFunction = '\x13'
const prefixArray = '\x14'
const prefixObject = '\x15'
const prefixBuiltin = '\x16'

/**
 * Calculate checksum value from a given value.
 * @param {*} value the value to calculate checksum
 * @param {object|{}} opts optional options
 * @param {string} opts.hash the hash function to use, default is 'md5', available values are 'md5', 'sha1', 'sha256' and 'sha512'
 * @returns {string} the hello message
 */
function checksum(value, opts = {}) {
  opts = opts || {}
  if (value === undefined || value === null) {
    return ''
  }
  let hashFunc = md5Hash
  if (opts.hash && typeof opts.hash === 'string') {
    switch (opts.hash.toLowerCase()) {
      case 'sha1':
        hashFunc = sha1Hash
        break
      case 'sha256':
        hashFunc = sha256Hash
        break
      case 'sha512':
        hashFunc = sha512Hash
        break
      default:
        hashFunc = md5Hash
    }
  }
  const typ = typeof value
  switch (typ) {
    case 'boolean':
      return hashFunc(`${prefixBoolean}${value}`)
    case 'function':
      return hashFunc(`${prefixFunction}${value}`)
    case 'number':
    case 'bigint':
      return hashFunc(`${prefixNumber}${value}`)
    case 'string':
      return hashFunc(`${value}`)
    case 'symbol':
      return hashFunc(`${prefixSymbol}${value.toString()}`)
    case 'object': {
      if (Array.isArray(value)) {
        let hashValue = hashFunc(`${prefixArray}[]`)
        for (const el of value) {
          hashValue = hashFunc(`${hashValue}${checksum(el, opts)}`)
        }
        return hashValue
      }
      const className = value.constructor.name
      const _checksumBuiltInObject = _checksumBuiltinObject(hashFunc, className, value, opts)
      if (_checksumBuiltInObject) {
        return _checksumBuiltInObject
      }
      const hashArr = []
      for (const key of Object.getOwnPropertyNames(value)) {
        hashArr.push(checksum([key, value[key]], opts))
      }
      return checksum([`${prefixObject}${className}`, ...hashArr.sort()], opts)
    }
  }
  return hashFunc(value)
}

function _checksumBuiltinObject(hashFunc, className, obj, opts) {
  switch (className) {
    case 'Date':
    case 'RegExp':
      return hashFunc(`${prefixBuiltin}${className}${obj}`)
    case 'Map': {
      const hashArr = []
      for (const [k, v] of obj) {
        hashArr.push(checksum([k, v], opts))
      }
      return checksum([`${prefixObject}${className}`, ...hashArr.sort()], opts)
    }
    case 'Set': {
      const hashArr = []
      for (const item of obj) {
        hashArr.push(checksum(item, opts))
      }
      return checksum([`${prefixObject}${className}`, ...hashArr.sort()], opts)
    }
  }
  return false
}

export {
  checksum
}
