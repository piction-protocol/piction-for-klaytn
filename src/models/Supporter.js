import Writer from '@models/Writer'

export default class SupporterPool {
  constructor(supporter = {investment: '0', collection: '0', distributionRate: '0', reward: '0'}) {
    this.investment = caver.utils.fromWei(supporter.investment);
    this.collection = caver.utils.fromWei(supporter.collection);
    this.distributionRate = caver.utils.fromWei((supporter.distributionRate * 100).toString());
    this.reward = caver.utils.fromWei(supporter.reward);
    this.writer = new Writer();
  }
}