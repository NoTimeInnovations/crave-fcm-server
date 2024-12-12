const express = require('express');
const cors = require('cors');
const { db } = require('./firebase/admin');
const notification = require('./firebase/notification');
const tokenRoutes = require('./routes/token');
const testRoutes = require('./routes/test');
const log = require('./utils/log');
const logRoutes = require('./routes/log');

const app = express();
app.use(express.json());
app.use(cors('*'));

app.use('/api', tokenRoutes);
app.use('/api', testRoutes);
app.use('/api' , logRoutes);


// Listen for new offers in Firebase Realtime Database
const offersRef = db.ref('offers');
offersRef.on('child_added', async (snapshot) => {
  const newOffer = snapshot.val();
  if (newOffer && newOffer.validUntil && new Date(newOffer.validUntil) > new Date()) {
    await notification.sendNewOfferNotification(newOffer);
  }
});


const PORT = 3002;
app.listen(PORT, () => log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/pages/LogPage.html');
})