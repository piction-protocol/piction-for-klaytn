import {abi} from '@contract-build-source/AccountManager'
import Web3Utils from '@utils/Web3Utils'

class AccountManager {
  constructor(address, from, gas) {
    this._contract = new caver.klay.Contract(abi, address);
    this._contract.options.from = from;
    this._contract.options.gas = gas;
  }

  getUserName(address) {
    return this._contract.methods.getUserName(address).call();
  }

  async getUserNames(addrs) {
    var result = await this._contract.methods.getUserNames(addrs).call();
    if (result.writerName_ == '')
      return [];
    else
      return Web3Utils.bytesToArray(result.writerName_, result.spos_, result.epos_);
  }

  isRegisteredUserName(userName) {
    return this._contract.methods.isRegisteredUserName(userName).call();
  }

  isRegisteredPrivateKey(privateKey) {
    return this._contract.methods.isRegisteredPrivateKey(privateKey).call();
  }

  login(userName, password) {
    return this._contract.methods.login(userName, password).call();
  }

  createNewAccount(userName, password, privateKey, publicKey) {
    this._contract.options.from = publicKey;
    return this._contract.methods.createNewAccount(userName, password, privateKey, publicKey).send();
  }

  setNewPassword(newPassword, passwordValidation) {
    return this._contract.methods.setNewPassword(newPassword, passwordValidation).send();
  }

  async getSupportComicsAddress(address) {
    let events = await this._contract.getPastEvents('SupportHistory', {
      filter: {_supporter: address},
      fromBlock: 0,
      toBlock: 'latest'
    });
    let addrs = events.map(event => Web3Utils.prettyJSON(event.returnValues).contentsAddress);
    return Array.from(new Set(addrs));
  }
}

export default AccountManager;
