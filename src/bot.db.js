const admin = require('firebase-admin');

const env = require('../environment/environment');

/**
 * Подключает базу данных
 */
const serviceAccount = require('../firebaseAdmin/firebaseAdminSDK.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: env.DATABASE_URL
});

const database = admin.database();

module.exports = {
  sessions: database.ref('sessions'),
  transactions: database.ref('transactions'),
  users: database.ref('users')
}