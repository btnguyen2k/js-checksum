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

/**
 * Calculate checksum value from a given value.
 * @param {*} value the value to calculate checksum
 * @param {object} opts optional options
 * @param {string} opts.hash the hash function to use, default is 'md5', available values are 'md5', 'sha1', 'sha256' and 'sha512'
 * @returns {string} the hello message
 */
function checksum(value, opts = {}) {
  if (value === undefined || value === null) {
    return ''
  }
  let hashFunc = md5Hash
  if (opts && opts.hash && typeof opts.hash === 'string') {
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

      const ownKeys = Object.getOwnPropertyNames(value)
      const simpleObjOwnKeys = {}
      ownKeys.forEach(key => {
        simpleObjOwnKeys[key] = value[key]
      })

      const allKeys = Object.keys(value)
      const simpleObjAllKeys = {}
      allKeys.forEach(key => {
        simpleObjAllKeys[key] = value[key]
      })

      return checksum([`${prefixObject}${className}`,
        _checksumSimpleObject(hashFunc, simpleObjOwnKeys, opts),
        _checksumSimpleObject(hashFunc, simpleObjAllKeys, opts)], opts)
    }
  }
  // return hashFunc(value)
}

function _checksumSimpleObject(hashFunc, obj, opts) {
  let hashValue = hashFunc(`${prefixArray}{}`)
  for (const key of Object.keys(obj).sort()) {
    const tempHashValue = checksum([key, obj[key]], opts)
    hashValue = hashFunc(`${hashValue}${tempHashValue}`)
    // for (let i = 0; i < hashValue.location; i++) {
    //   hashValue[i] ^= tempHashValue[i]
    // }
  }
  return hashValue
}

export {
  checksum
}
