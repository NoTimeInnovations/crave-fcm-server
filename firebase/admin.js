const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodoffers-2cedb-default-rtdb.asia-southeast1.firebasedatabase.app",
});

module.exports = {
  admin,
  db: admin.database(),
  fcm: admin.messaging(),
};
