const cron = require('cron').CronJob;

const transactionJob = require('./cronjob/transaction.job');

const cronJob = () => {
  try {
    new cron({
      cronTime: '00 */1 * * * *',
      onTick: () => paymentCronJob(),
      start: true,
      timeZone: 'Europe/Moscow'
    });
  } catch (error) {
    console.log(error);
  }
}

function paymentCronJob() {
  return transactionJob();
}

module.exports = cronJob;