import md5 from 'crypto-js/md5.js'
import sha1 from 'crypto-js/sha1.js'
import sha256 from 'crypto-js/sha256.js'
import sha512 from 'crypto-js/sha512.js'

const md5Hash = (value) => md5(value).toString().toLowerCase()
const sha1Hash = (value) => sha1(value).toString().toLowerCase()
const sha256Hash = (value) => sha256(value).toString().toLowerCase()
const sha512Hash = (value) => sha512(value).toString().toLowerCase()

/**
 * Calculate checksum value from a given value.
 * @param {*} value the value to calculate checksum
 * @param {object|{}} opts optional options
 * @param {string} opts.hash the hash function to use, default is 'md5', available values are 'md5', 'sha1', 'sha256' and 'sha512'
 * @param {bool} opts.disable_warning_cyclic (default: false) disable warning message when cyclic reference is detected
 * @returns {string} the hello message
 */
function checksum(value, opts = {}) {
  const cycman = new CyclicManager()
  cycman.visit(value)
  return myChecksum(value, opts, cycman)
}

const prefixBoolean = '\x10'
const prefixNumber = '\x11'
const prefixSymbol = '\x12'
const prefixFunction = '\x13'
const prefixArray = '\x14'
const prefixObject = '\x15'
const prefixBuiltin = '\x16'

class CyclicManager {
  constructor() {
    this.stack = []
    this.stackSet = new Set()
  }

  visit(value) {
    if (value === undefined || value === null || typeof value !== 'object') {
      return true
    }
    if (this.stackSet.has(value)) {
      return false
    }
    this.stack.push(value)
    this.stackSet.add(value)
    return true
  }

  leave(value) {
    if (value === undefined || value === null || typeof value !== 'object') {
      return
    }
    this.stack.pop()
    this.stackSet.delete(value)
  }
}

function myChecksum(value, opts, cycman) {
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
        value.forEach((el, i) => {
          if (cycman.visit(el)) {
            hashValue = hashFunc(`${hashValue}${i}${myChecksum(el, opts, cycman)}`)
            cycman.leave(el)
          } else if (!opts.disable_warning_cyclic) {
            console.warn(`cyclic reference detected at element #${i}: ${el}`)
          }
        })
        return hashValue
      }
      const className = value.constructor.name
      const _checksumBuiltInObject = _checksumBuiltinObject(hashFunc, className, value, opts, cycman)
      if (_checksumBuiltInObject) {
        return _checksumBuiltInObject
      }
      const hashArr = []
      for (const key of Object.getOwnPropertyNames(value)) {
        const obj = value[key]
        if (cycman.visit(obj)) {
          hashArr.push(myChecksum([key, obj], opts, cycman))
          cycman.leave(obj)
        } else if (!opts.disable_warning_cyclic) {
          console.warn(`cyclic reference detected at element #${key}: ${obj}`)
        }
      }
      return myChecksum([`${prefixObject}${className}`, ...hashArr.sort()], opts, cycman)
    }
  }
  return hashFunc(value)
}

function _checksumBuiltinObject(hashFunc, className, obj, opts, cycman) {
  switch (className) {
    case 'Date':
    case 'RegExp':
      return hashFunc(`${prefixBuiltin}${className}${obj}`)
    case 'Map': {
      const hashArr = []
      for (const [k, v] of obj) {
        if (cycman.visit(v)) {
          hashArr.push(myChecksum([k, v], opts, cycman))
          cycman.leave(v)
        } else if (!opts.disable_warning_cyclic) {
          console.warn(`cyclic reference detected at element #${k}: ${v}`)
        }
      }
      return myChecksum([`${prefixObject}${className}`, ...hashArr.sort()], opts, cycman)
    }
    case 'Set': {
      const hashArr = []
      for (const item of obj) {
        if (cycman.visit(item)) {
          hashArr.push(myChecksum(item, opts, cycman))
          cycman.leave(item)
        } else if (!opts.disable_warning_cyclic) {
          console.warn(`cyclic reference detected at element: ${item}`)
        }
      }
      return myChecksum([`${prefixObject}${className}`, ...hashArr.sort()], opts, cycman)
    }
  }
  return false
}

export {
  checksum
}
