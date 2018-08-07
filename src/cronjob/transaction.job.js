const coinpayments = require('../bot.payments');

const database = require('../bot.db').users;
const transactionsdb = require('../bot.db').transactions;

const paymentCronJob = async () => {
  const ids = [];
  const transactions = await transactionsdb
    .orderByChild("isAlive").equalTo(true).once('value').then((snapshot) => {
      const transactions = snapshot.val();
      for (const key in transactions) {
        ids.push(transactions[key].txn_id);
      }
    });

  coinpayments.getTxMulti(ids, (err, response) => {
    if (err) {
      return;
    }
    for (const key in response) {
      if (response[key].status >= 100 || true) {
        closeTransactionSuccess(key, response[key]);
      } else if (response[key].status < 0) {
        closeTransactionError(key, response[key]);
      }
    }
  });
}

/**
 * Закрывает транзакцию по полученному id транзакции, начисляет реф премию
 *
 * @param txnId
 * @param transactions
 */
async function closeTransactionSuccess(txnId, transaction) {
  const setting = {
    refill: {
      type: 'classic',
      options: [30]
    }
  }
  const { refill } = setting;

  try {
    let trId, trModel;
    await transactionsdb.orderByChild('txn_id').equalTo(txnId).once('value').then((snapshot) => {
      Object.keys(snapshot.val()).forEach((key) => {
        trId = key;
        trModel = snapshot.val()[key];
      });
    });

    const user = await database.once('value').then((snapshot) => snapshot.child(trModel.userId).val() );

    // await transactionsdb.child(`${trId}`).update({
    //   coin: transaction.coin,
    //   isAlive: false,
    //   status: transaction.status,
    //   statusText: transaction.status_text
    // });

    const income = ( transaction.received / transaction.amount ).toFixed(2);

    await database.child(`${trModel.userId}/currencies/gold`).update({
      amount: +user.currencies.gold.amount + +income
    });

    if (refill.type === 'classic') {
      await giveRefFeeClassic(refill.options, trModel.userId, 20.02);
    }

    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * Рекурсивная асинхронная функция начисления реф премии исходя из опций
 *
 * @private
 * @param {string[]} options
 * @param {string} userId
 * @param {string} amount
 * @returns {Promise<any>}
 * @memberof CoinpaymentsService
 */
async function giveRefFeeClassic(options, userId, amount) {
  let counter = 0;
  const userModel = database;

  async function work() {
    const user = await database.once('value').then((snapshot) => snapshot.child(userId).val() );

    if (user.refferer) {
      let reffererId, reffererModel; 
      await database.once('value').then((snapshot) => {
        reffererId = snapshot.child(user.refferer).key;
        reffererModel = snapshot.child(user.refferer).val();
      });

      const procent = options[counter];
      const fee = +amount / 100 * +procent;

      await database.child(`${reffererId}/currencies/out`).update({
        amount: +reffererModel.currencies.out.amount + +fee
      });
    } else {
      return;
    }

    if (counter < options.length) {
      counter++;
      await work();
    }

    return;
  }

  return work();
}

/**
 * Закрывает транзакцию, т.к. она завершенна с какой то ошибкой
 */
async function closeTransactionError(txnId, transaction) {
  let key, model;
  await transactionsdb.orderByChild('txn_id').equalTo(txnId).once('value').then((snapshot) => {
    return snapshot.forEach(function(childSnapshot) {
      key = childSnapshot.key;
      model = childSnapshot.val();
    });
  });

  await transactionsdb.child(`${key}`).update({
    coin: transaction.coin,
    isAlive: false,
    status: transaction.status,
    statusText: transaction.status_text
  });
}

module.exports = paymentCronJob;