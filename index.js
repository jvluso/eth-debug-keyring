const EventEmitter = require('events').EventEmitter
const ethUtil = require('ethereumjs-util')

const FIELDS = [
  'nonce',
  'gasPrice',
  'gasLimit',
  'to',
  'value',
  'data',
]


// Options:
const type = 'Debug Key'

class DebugKeyring extends EventEmitter {

  /* PUBLIC METHODS */

  constructor (opts = {}) {
    super()
    this.type = type
    this.deserialize(opts)
  }

  serialize () {
    return Promise.resolve({
      mockAddresses: this.mockAddresses,
    })
  }

  deserialize (opts = {}) {
    this.opts = opts || {}
    this.wrapper = {}
    this.mockAddresses = opts.mockAddresses

    return Promise.resolve([])
  }

  addAccounts (numberOfAccounts = 1) {
    throw new Error('Not supported')
  }

  getAccounts () {
    return Promise.resolve(this.mockAddresses)
  }

  // tx is an instance of the ethereumjs-transaction class.
  signTransaction (address, tx) {
    var serialized = { from: address }
    FIELDS.forEach((field) => {
      const value = ethUtil.bufferToHex(tx[field])
      serialized[field] = ethUtil.bufferToHex(tx[field])
    })

    throw new Error(JSON.stringify(serialized))
  }


  signMessage (withAccount, data) {
    throw new Error(JSON.stringify(data))
  }


  signPersonalMessage (withAccount, msgHex) {
    throw new Error(JSON.stringify(msgHex))
  }


  signTypedData (withAccount, typedData) {
    throw new Error(JSON.stringify(typedData))
  }


  newGethSignMessage (withAccount, msgHex) {
    throw new Error(JSON.stringify(msgHex))
  }

  exportAccount (address) {
    throw new Error('Not supported')
  }

}

DebugKeyring.type = type
module.exports = DebugKeyring
