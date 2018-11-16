export default class DepositHistory {
  constructor(history) {
    this.date = history.date;
    this.type = history.type;
    this.amount = caver.utils.fromWei(history.amount);
    this.description = history.description;
  }
}