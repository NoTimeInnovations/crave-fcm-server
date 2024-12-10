const express = require('express');
const cors = require('cors');
const { db } = require('./firebase/admin');
const notification = require('./firebase/notification');
const tokenRoutes = require('./routes/token');
const testRoutes = require('./routes/test');

const app = express();
app.use(express.json());
app.use(cors('*'));

// Import Routes
app.use('/api', tokenRoutes);
app.use('/api', testRoutes);

// Listen for new offers in Firebase Realtime Database
const offersRef = db.ref('offers');
offersRef.on('child_added', async (snapshot) => {
  const newOffer = snapshot.val();
  if (newOffer && newOffer.validUntil && new Date(newOffer.validUntil) > new Date()) {
    await notification.sendNewOfferNotification(newOffer);
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
