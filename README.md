# Piction for Klaytn

> This project is a prototype for testing Klaytn.

 - [Demo](http://klaytn.piction.network)

## Requirement
- [truffle](https://github.com/trufflesuite/truffle) (global dependency)
- [node-js](https://nodejs.org) (global dependency)
- [zeppelin-solidity](https://github.com/OpenZeppelin/openzeppelin-solidity)
- [truffle-hdwallet-provider-privkey](https://github.com/rhlsthrm/truffle-hdwallet-provider-privkey)
- [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow)
- [caver.js](https://docs.klaytn.com/getting_started/quick_start.html#installing-caverjs)

## Setting

`truffle-hdwallet-provider-privkey` uses wallet's private key to authenticate accounts in ethereum network.
Register developer's wallet address and private key in `.env.klaytn` like this.

```javascript
$ cp .env .env.klaytn

--- .env.klaytn ---
PRIVATE_KEY=<PRIVATE_KEY>
```

## Install 

```
$ npm install -g truffle
$ npm install // install node_modules in package.json
```

## Compile

```
$ truffle compile
```

## Deploy
- Deploy
```
$ truffle migrate --network klaytn
```
- Set Contract
```
$ node set_contract_script.js
```

## Run dApp

```
$ npm run dev

```

## License

This is available under the MIT license. See the LICENSE file for more info.