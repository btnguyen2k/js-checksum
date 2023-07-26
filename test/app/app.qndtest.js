import {checksum} from '../../src/index.js'

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
console.log(checksum(input1))

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
console.log(checksum(input2))
