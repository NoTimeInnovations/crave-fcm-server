const express = require("express");
const cors = require("cors");
const { db } = require("./firebase/admin");
const notification = require("./firebase/notification");
const tokenRoutes = require("./routes/topic");
const testRoutes = require("./routes/test");
const log = require("./utils/log");
const dataRoute = require("./routes/data");
const autoDeleteExpiredOffers = require("./utils/autoDeleteExpiredOffer");
const pagesRoutes = require("./routes/pages");

const app = express();
app.use(express.json());
app.use(cors("*"));

app.use("/api/topic", tokenRoutes);
app.use("/api", testRoutes);
app.use("/api", dataRoute);
app.use('/',pagesRoutes)

// Listen for new offers in Firebase Realtime Database
const offersRef = db.ref("offers");
offersRef.on("child_added", async (snapshot) => {
  const newOffer = snapshot.val();
  if (
    newOffer &&
    newOffer.validUntil &&
    new Date(newOffer.validUntil) > new Date()
  ) {
    await notification.sendNewOfferNotification(newOffer);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
  setInterval(autoDeleteExpiredOffers, 10000);
});

