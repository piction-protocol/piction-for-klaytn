import {abi} from '@contract-build-source/ContentsManager'

class ContentsManager {
  constructor(address, from, gas) {
    this._contract = new caver.klay.Contract(abi, address);
    this._contract.options.from = from;
    this._contract.options.gas = gas;
  }

  getContract() {
    return this._contract;
  }
}

export default ContentsManager;
