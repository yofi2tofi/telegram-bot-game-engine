const Coinpayments = require('coinpayments');

const coinpaymentsConfig = require('../coinpayments/coinpayments.config.json');

const coinpayments = new Coinpayments(coinpaymentsConfig);

module.exports = coinpayments;