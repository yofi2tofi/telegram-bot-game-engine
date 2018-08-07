class TransactionClass {
  constructor(data) {
    this.userId = data.userId;
    this.amount = data.amount;
    this.txn_id = data.txn_id;
    this.address = data.address;
    this.confirms_needed = data.confirms_needed;
    this.timeout = data.timeout;
    this.status_url = data.status_url;
    this.qrcode_url = data.qrcode_url;
    this.isPayed = false;
    this.isAlive = true;
  }
}

module.exports = TransactionClass;