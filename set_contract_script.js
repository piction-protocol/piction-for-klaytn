require('dotenv-flow').config({default_node_env: 'klaytn'});
const BigNumber = require('bignumber.js');
const Caver = require('caver-js');
const caver = new Caver('http://52.78.136.229:8551');

(async () => {
  const privateKey = '0x' + process.env.PRIVATE_KEY;
  const account = caver.klay.accounts.wallet.add(privateKey);
  const pxlSource = await require('./build/contracts/PXL.json');
  const accountManagerSource = await require('./build/contracts/AccountManager.json');

  // PXL mint
  let contract = await new caver.klay.Contract(pxlSource.abi, pxlSource.networks[1000].address, {
    from: account.address,
    gas: 6000000
  });
  const amount = BigNumber('10000000000000000000000000');
  await contract.methods.mint(amount).send();
  console.log('PXL mint', amount)

  // account manager pxl transfer
  const myBalance = await contract.methods.balanceOf(account.address).call()
  await contract.methods.transfer(accountManagerSource.networks[1000].address, myBalance).send()
  const accountManagerBalance = await contract.methods.balanceOf(accountManagerSource.networks[1000].address).call()
  console.log('account manager balance', accountManagerBalance);

  // PXL unlock
  await contract.methods.unlock().send()
  console.log('PXL unlock');

  try {
    contract = await new caver.klay.Contract(accountManagerSource.abi, accountManagerSource.networks[1000].address);
    contract.options.from = account.address;
    contract.options.gas = 6000000;
    await contract.methods.createNewAccount(process.env.COUNCIL_ID, process.env.COUNCIL_PW, privateKey, account.address).send();
    console.log('create account council');
  } catch (e) {
  }

  const decimals = Math.pow(10, 18);

  const initialDeposit = 10 * decimals;
  const reportRegistrationFee = 10 * decimals;
  const depositReleaseDelay = 1000 * 60 * 10 // 10 min;
  const fundAvailable = true;

  const cdRate = 0.15 * decimals;
  const userPaybackRate = 0.02 * decimals;

  const councilSource = await require('./build/contracts/Council.json');
  contract = await new caver.klay.Contract(councilSource.abi, councilSource.networks[1000].address);
  contract.options.from = account.address;
  contract.options.gas = 6000000;

  await contract.methods.initialValue(
    initialDeposit,
    reportRegistrationFee,
    depositReleaseDelay,
    fundAvailable
  ).send();
  console.log('set initial value');

  await contract.methods.initialRate(
    cdRate,
    userPaybackRate,
  ).send();
  console.log('set initial rate');

  await contract.methods.initialPictionAddress(
    require('./build/contracts/UserPaybackPool.json').networks[1000].address,
    require('./build/contracts/DepositPool.json').networks[1000].address,
    require('./build/contracts/SupporterPool.json').networks[1000].address,
    require('./build/contracts/PxlDistributor.json').networks[1000].address,
    require('./build/contracts/Report.json').networks[1000].address,
    account.address
  ).send();
  console.log('set initial piction address');

  await contract.methods.initialManagerAddress(
    require('./build/contracts/ContentsManager.json').networks[1000].address,
    require('./build/contracts/FundManager.json').networks[1000].address,
    require('./build/contracts/AccountManager.json').networks[1000].address
  ).send();
  console.log('set initial manager address');

  await contract.methods.initialApiAddress(
    require('./build/contracts/ApiContents.json').networks[1000].address,
    require('./build/contracts/ApiReport.json').networks[1000].address,
    require('./build/contracts/ApiFund.json').networks[1000].address
  ).send();
  console.log('set initial api address');

  console.log('set contract success');
})();