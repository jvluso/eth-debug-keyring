const EventEmitter = require('events').EventEmitter
const initAragonJS = require('./aragonjs-wrapper');

// Options:
const type = 'Aragon Key'

class AragonKeyring extends EventEmitter {

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
    this.subProvider = {}
    this.ens = opts.ens
    this.dao = opts.dao
    this.forwardingAddress = opts.forwardingAddress
    this.parentAddress = opts.parentAddress

    return Promise.resolve([])
  }

  addAccounts (numberOfAccounts = 1) {
    throw new Error('Not supported')
  }

  getAccounts () {
    return Promise.resolve([forwardingAddress])
  }

  // the provider needs to be injected somewhere, as does some way of passing the transaction to the final signer
  setProvider (subProvider, providerSignTransaction) {
    this.subProvider = subProvider
    this.providerSignTransaction = providerSignTransaction
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
      this.providerSignTransaction(result[0],this.parentAddress)
    })
  }


  signMessage (withAccount, data) {
    throw new Error('Not supported')
  }


  signPersonalMessage (withAccount, msgHex) {
    throw new Error('Not supported')
  }


  signTypedData (withAccount, typedData) {
    throw new Error('Not supported')
  }


  newGethSignMessage (withAccount, msgHex) {
    throw new Error('Not supported')
  }

  exportAccount (address) {
    throw new Error('Not supported')
  }


  /* PRIVATE METHODS */


  _getWallet () {
    if(!this.subProvider){
      throw new Error('supProvider not provided')
    }
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

AragonKeyring.type = type
module.exports = AragonKeyring
