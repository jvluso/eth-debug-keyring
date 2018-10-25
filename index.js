const EventEmitter = require('events').EventEmitter
const hdkey = require('ethereumjs-wallet/hdkey')
const bip39 = require('bip39')
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')

// Options:
const hdPathString = `m/44'/60'/0'/0`
const type = 'HD Key Tree'

class HdKeyring extends EventEmitter {

  /* PUBLIC METHODS */

  constructor (opts = {}) {
    super()
    this.type = type
    this.deserialize(opts)
  }

  serialize () {
    return Promise.resolve({
      ens: this.ens,
      dao: this.dao,
      forwardingAddress: this.forwardingAddress,
      parentAddress: this.parentAddress
    })
  }

  deserialize (opts = {}) {
    this.opts = opts || {}
    this.wrapper = {}
    this.ens = ens
    this.dao = dao
    this.forwardingAddress = sigUtil.normalize(forwardingAddress)
    this.parentAddress = sigUtil.normalize(parentAddress)

    return Promise.resolve([])
  }

  addAccounts (numberOfAccounts = 1) {
    return Promise.resolve([forwardingAddress])
  }

  getAccounts () {
    return Promise.resolve([forwardingAddress])
  }

  // tx is an instance of the ethereumjs-transaction class.
  signTransaction (address, tx) {
    return this._getWallet()
    .then((wrapper) =>{
      return wrapper.calculateForwardingPath(
        this.parentAddress,
        tx.to,
        tx,
        [tx.from])
    })
    .then(result => {
      this.subProvider.send(result[0],this.parentAddress)
    })
  }

  // For eth_sign, we need to sign transactions:
  // hd
  signMessage (withAccount, data) {
    const wallet = this._getWallet()
    const message = ethUtil.stripHexPrefix(data)
    var privKey = wallet.getPrivateKey()
    var msgSig = ethUtil.ecsign(new Buffer(message, 'hex'), privKey)
    var rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
    return Promise.resolve(rawMsgSig)
  }

  // For personal_sign, we need to prefix the message:
  signPersonalMessage (withAccount, msgHex) {
    const wallet = this._getWallet()
    const privKey = ethUtil.stripHexPrefix(wallet.getPrivateKey())
    const privKeyBuffer = new Buffer(privKey, 'hex')
    const sig = sigUtil.personalSign(privKeyBuffer, { data: msgHex })
    return Promise.resolve(sig)
  }

  // personal_signTypedData, signs data along with the schema
  signTypedData (withAccount, typedData) {
    const wallet = this._getWallet()
    const privKey = ethUtil.toBuffer(wallet.getPrivateKey())
    const signature = sigUtil.signTypedData(privKey, { data: typedData })
    return Promise.resolve(signature)
  }

  // For eth_sign, we need to sign transactions:
  newGethSignMessage (withAccount, msgHex) {
    const wallet = this._getWallet()
    const privKey = wallet.getPrivateKey()
    const msgBuffer = ethUtil.toBuffer(msgHex)
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer)
    const msgSig = ethUtil.ecsign(msgHash, privKey)
    const rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
    return Promise.resolve(rawMsgSig)
  }

  exportAccount (address) {
    const wallet = this._getWallet()
    return Promise.resolve(wallet.getPrivateKey().toString('hex'))
  }


  /* PRIVATE METHODS */


  _getWallet () {
    if(this.wrapper){
      return (promise.resolve(this.wrapper))
    }
    return initAragonJS(this.dao, this.ens, {
      accounts: this.accounts,
      provider: this.subProvider
    })
    .then((initializedWrapper) => {
      this.wrapper = initializedWrapper
      return this.wrapper
    })
  }
}

HdKeyring.type = type
module.exports = HdKeyring
